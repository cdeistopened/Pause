import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MessageSquare, Send, Volume2 } from 'lucide-react-native';
import { useState, useRef, useCallback } from 'react';
import { getCoachResponse, CoachAction } from '@/services/gemini';
import { speakText, stopSpeaking } from '@/services/elevenlabs';
import { router } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Map coach action exercise IDs to app exercise IDs
const EXERCISE_ID_MAP: Record<string, string> = {
  breathing: 'breath',
  golden_light: 'light',
  counting: 'count',
  self_talk: 'talk',
  relaxation: 'relax',
};

export default function CoachScreen() {
  const [mode, setMode] = useState<'voice' | 'chat'>('voice');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Backend mutations
  const addIntention = useMutation(api.intentions.add);

  // Execute coach actions
  const executeAction = useCallback(async (action: CoachAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    switch (action.type) {
      case 'START_EXERCISE':
        // Navigate to PAUSE tab with exercise pre-selected
        const exerciseId = EXERCISE_ID_MAP[action.id || 'breathing'] || 'breath';
        router.push({
          pathname: '/',
          params: { exercise: exerciseId, autoStart: 'true' }
        });
        break;

      case 'SHOW_PROGRESS':
        router.push('/habits');
        break;

      case 'SHOW_HABITS':
        router.push('/settings');
        break;

      case 'CAPTURE_INTENTION':
        if (action.text) {
          try {
            await addIntention({ text: action.text });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (e) {
            console.error('Failed to save intention:', e);
          }
        }
        break;

      case 'PLAY_CONTENT':
        // Navigate to library with content ID
        router.push({
          pathname: '/library',
          params: { contentId: action.id }
        });
        break;

      default:
        console.log('Unknown action type:', action.type);
    }
  }, [addIntention]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await getCoachResponse(
        text,
        messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.content }))
      );

      const assistantMessage: Message = { role: 'assistant', content: response.message };
      setMessages(prev => [...prev, assistantMessage]);

      // Execute any action returned by the coach
      if (response.action) {
        // Small delay to let the message render before navigation
        setTimeout(() => {
          executeAction(response.action!);
        }, 500);
      }

      if (mode === 'voice') {
        setIsSpeaking(true);
        try {
          await speakText(response.message);
        } catch (e) {
          console.error('TTS error:', e);
        }
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Coach error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now. Let's try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    Haptics.selectionAsync();
    stopSpeaking();
    setMode(mode === 'voice' ? 'chat' : 'voice');
  };

  const handleQuickPrompt = (prompt: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(prompt);
  };

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
          <Text className="text-text-primary text-2xl font-bold">Coach</Text>
          <Pressable
            className="flex-row items-center bg-surface-dark px-3 py-1.5 rounded-full gap-1.5"
            onPress={toggleMode}
          >
            {mode === 'voice' ? (
              <>
                <MessageSquare size={14} color="#8A9BB5" />
                <Text className="text-text-secondary text-xs font-medium">Chat</Text>
              </>
            ) : (
              <>
                <Mic size={14} color="#8A9BB5" />
                <Text className="text-text-secondary text-xs font-medium">Voice</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Messages / Avatar Area */}
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-5">
            <View className="w-28 h-28 rounded-full bg-surface-dark items-center justify-center mb-5 border-2 border-primary">
              <Text className="text-primary text-xl font-semibold">Dr. M</Text>
            </View>
            <Text className="text-text-primary text-lg italic text-center">
              "What's on your mind today?"
            </Text>
            {isSpeaking && (
              <View className="flex-row items-center mt-4 gap-1.5">
                <Volume2 size={16} color="#d4a954" />
                <Text className="text-primary text-sm">Speaking...</Text>
              </View>
            )}
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-5"
            contentContainerStyle={{ paddingVertical: 10 }}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
          >
            {messages.map((msg, index) => (
              <View
                key={index}
                className={`max-w-[80%] px-4 py-3 rounded-2xl mb-3 ${
                  msg.role === 'user'
                    ? 'bg-surface-dark self-end rounded-br-sm'
                    : 'bg-primary/15 self-start rounded-bl-sm border border-primary/20'
                }`}
              >
                <Text
                  className={`text-[15px] leading-[21px] ${
                    msg.role === 'user' ? 'text-text-primary' : 'text-text-primary'
                  }`}
                >
                  {msg.content}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View className="self-start p-3">
                <ActivityIndicator size="small" color="#d4a954" />
              </View>
            )}
            {isSpeaking && (
              <View className="flex-row items-center gap-1.5 mt-2">
                <Volume2 size={14} color="#d4a954" />
                <Text className="text-primary text-sm">Speaking...</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Input Area */}
        <View className="px-5 pb-28 pt-3 border-t border-white/10">
          {mode === 'voice' ? (
            <View className="items-center py-4">
              <Pressable
                className={`w-20 h-20 rounded-full items-center justify-center border-2 border-primary mb-3 ${
                  isRecording ? 'bg-primary scale-110' : 'bg-surface-dark'
                }`}
                onPressIn={() => setIsRecording(true)}
                onPressOut={() => setIsRecording(false)}
              >
                <Mic size={32} color={isRecording ? '#0A0E1A' : '#d4a954'} />
              </Pressable>
              <Text className="text-text-secondary/60 text-sm">
                {isRecording ? 'Listening...' : 'Hold to speak'}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-end bg-surface-dark rounded-3xl px-4 py-2 mb-3">
              <TextInput
                className="flex-1 text-text-primary text-base py-2 max-h-[100px]"
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#5A6B7D"
                multiline
                onSubmitEditing={() => sendMessage(inputText)}
              />
              <Pressable className="p-2 ml-2" onPress={() => sendMessage(inputText)}>
                <Send size={20} color={inputText.trim() ? '#d4a954' : '#5A6B7D'} />
              </Pressable>
            </View>
          )}

          {/* Quick Prompts */}
          <View className="flex-row justify-center gap-2 mt-2">
            {["I'm anxious", 'Help me focus', 'Need energy'].map((prompt) => (
              <Pressable
                key={prompt}
                className="bg-surface-dark px-4 py-2 rounded-full active:opacity-70"
                onPress={() => handleQuickPrompt(prompt)}
              >
                <Text className="text-text-secondary text-sm">{prompt}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
