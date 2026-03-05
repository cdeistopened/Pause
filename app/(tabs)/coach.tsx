import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, Keyboard, Send, Volume2, MicOff, X } from 'lucide-react-native';
import { getCoachResponse, CoachAction } from '@/services/gemini';
import { speakText, stopSpeaking } from '@/services/elevenlabs';
import {
  startListening,
  stopListening,
  isSpeechRecognitionSupported,
} from '@/services/speechRecognition';
import { router } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#d4a954',
  primaryLight: '#f3d08c',
  background: '#0A0E1A',
  surface: '#1A2B3C',
  surfaceHighlight: '#23364A',
  textPrimary: '#F0F4F8',
  textSecondary: '#8A9BB5',
  textGold: '#FFEBB8',
  coachBubble: 'rgba(212, 168, 83, 0.15)',
  coachBubbleBorder: 'rgba(212, 168, 83, 0.25)',
  userBubble: '#23364A',
  online: '#22C55E',
  border: 'rgba(255, 255, 255, 0.1)',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const EXERCISE_ID_MAP: Record<string, string> = {
  breathing: 'breath',
  golden_light: 'light',
  counting: 'count',
  self_talk: 'talk',
  relaxation: 'relax',
};

const QUICK_PROMPTS = [
  "I'm anxious",
  'Help me focus',
  'Need energy',
  'Feeling stressed',
  "Can't sleep",
];

function DrMillerAvatar({ size = 112 }: { size?: number }) {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [pulseScale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.avatarText}>Dr. M</Text>
      </View>
      {/* Online indicator */}
      <Animated.View style={[styles.onlineIndicator, pulseStyle]} />
    </View>
  );
}

function MicButton({
  isRecording,
  disabled,
  onPressIn,
  onPressOut,
}: {
  isRecording: boolean;
  disabled: boolean;
  onPressIn: () => void;
  onPressOut: () => void;
}) {
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (isRecording) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      glowOpacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [isRecording, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.micButtonContainer}>
      <Animated.View
        style={[
          styles.micButtonGlow,
          glowStyle,
          isRecording && styles.micButtonGlowActive,
        ]}
      />
      <Pressable
        style={[
          styles.micButton,
          isRecording && styles.micButtonActive,
          disabled && styles.micButtonDisabled,
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityLabel={isRecording ? 'Release to send' : 'Hold to speak'}
        accessibilityRole="button"
      >
        {disabled ? (
          <MicOff size={40} color={COLORS.textSecondary} />
        ) : (
          <Mic size={40} color={isRecording ? COLORS.background : COLORS.primary} />
        )}
      </Pressable>
    </View>
  );
}

export default function CoachScreen() {
  const [mode, setMode] = useState<'voice' | 'chat'>('voice');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
  }, []);

  const addIntention = useMutation(api.intentions.add);

  const executeAction = useCallback(
    async (action: CoachAction) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      switch (action.type) {
        case 'START_EXERCISE':
          const exerciseId = EXERCISE_ID_MAP[action.id || 'breathing'] || 'breath';
          router.push({
            pathname: '/',
            params: { exercise: exerciseId, autoStart: 'true' },
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
          router.push({
            pathname: '/library',
            params: { contentId: action.id },
          });
          break;

        default:
          console.log('Unknown action:', action.type);
      }
    },
    [addIntention]
  );

  const sendMessage = async (text: string) => {
    const sanitizedText = text.trim().slice(0, 1000);
    if (!sanitizedText || isLoading) return;

    const userMessage: Message = { role: 'user', content: sanitizedText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await getCoachResponse(
        text,
        messages.map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          content: m.content,
        }))
      );

      const assistantMessage: Message = { role: 'assistant', content: response.message };
      setMessages((prev) => [...prev, assistantMessage]);

      if (response.action) {
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
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Let's try again in a moment.",
        },
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

  const handleMicPressIn = () => {
    if (!speechSupported) return;
    setIsRecording(true);
    setInterimTranscript('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    startListening({
      onResult: (transcript, isFinal) => {
        setInterimTranscript(transcript);
        if (isFinal && transcript.trim()) {
          sendMessage(transcript);
          setInterimTranscript('');
        }
      },
      onError: (error) => {
        console.error('Speech error:', error);
        setIsRecording(false);
      },
      onEnd: () => {
        setIsRecording(false);
      },
    });
  };

  const handleMicPressOut = () => {
    stopListening();
    setIsRecording(false);
    if (interimTranscript.trim()) {
      sendMessage(interimTranscript);
      setInterimTranscript('');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Coach</Text>
          <Pressable style={styles.modeToggle} onPress={toggleMode}>
            {mode === 'voice' ? (
              <>
                <Keyboard size={16} color={COLORS.textSecondary} />
                <Text style={styles.modeToggleText}>Type</Text>
              </>
            ) : (
              <>
                <Mic size={16} color={COLORS.textSecondary} />
                <Text style={styles.modeToggleText}>Voice</Text>
              </>
            )}
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Messages / Avatar Area */}
          {messages.length === 0 ? (
            <Animated.View entering={FadeIn.duration(600)} style={styles.emptyState}>
              <DrMillerAvatar />
              <Text style={styles.emptyStateQuote}>"What's on your mind today?"</Text>
              {isSpeaking && (
                <View style={styles.speakingIndicator}>
                  <Volume2 size={16} color={COLORS.primary} />
                  <Text style={styles.speakingText}>Speaking...</Text>
                </View>
              )}
            </Animated.View>
          ) : (
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInUp.duration(300)}
                  style={[
                    styles.messageBubble,
                    msg.role === 'user' ? styles.userBubble : styles.coachBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.role === 'assistant' && styles.coachMessageText,
                    ]}
                  >
                    {msg.content}
                  </Text>
                </Animated.View>
              ))}
              {isLoading && (
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              )}
              {isSpeaking && (
                <View style={styles.speakingRow}>
                  <Volume2 size={14} color={COLORS.primary} />
                  <Text style={styles.speakingText}>Speaking...</Text>
                </View>
              )}
            </ScrollView>
          )}

          {/* Input Area */}
          <View style={styles.inputArea}>
            {mode === 'voice' ? (
              <View style={styles.voiceInputContainer}>
                {!speechSupported && (
                  <Text style={styles.noSpeechText}>
                    Voice input not supported. Use chat mode.
                  </Text>
                )}
                <MicButton
                  isRecording={isRecording}
                  disabled={!speechSupported || isLoading}
                  onPressIn={handleMicPressIn}
                  onPressOut={handleMicPressOut}
                />
                <Text style={styles.micHint}>
                  {isRecording
                    ? interimTranscript || 'Listening...'
                    : speechSupported
                    ? 'Hold to speak'
                    : 'Voice unavailable'}
                </Text>
              </View>
            ) : (
              <View style={styles.chatInputContainer}>
                <View style={styles.chatInputWrapper}>
                  <TextInput
                    style={styles.chatInput}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor={COLORS.textSecondary}
                    multiline
                    maxLength={1000}
                    onSubmitEditing={() => sendMessage(inputText)}
                  />
                  <Pressable
                    style={styles.sendButton}
                    onPress={() => sendMessage(inputText)}
                    disabled={!inputText.trim() || isLoading}
                  >
                    <Send
                      size={22}
                      color={inputText.trim() ? COLORS.primary : COLORS.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Quick Prompts */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickPromptsScroll}
              contentContainerStyle={styles.quickPromptsContent}
            >
              {QUICK_PROMPTS.map((prompt) => (
                <Pressable
                  key={prompt}
                  style={({ pressed }) => [
                    styles.quickPrompt,
                    pressed && styles.quickPromptPressed,
                  ]}
                  onPress={() => handleQuickPrompt(prompt)}
                >
                  <Text style={styles.quickPromptText}>{prompt}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modeToggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  keyboardView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.online,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  emptyStateQuote: {
    fontSize: 20,
    fontWeight: '400',
    fontStyle: 'italic',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
  },
  speakingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  speakingText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  speakingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 6,
  },
  coachBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.coachBubble,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.coachBubbleBorder,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  coachMessageText: {
    color: COLORS.textGold,
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    padding: 16,
  },
  inputArea: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  voiceInputContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noSpeechText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  micButtonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  micButtonGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
  },
  micButtonGlowActive: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  micButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  micButtonActive: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  micButtonDisabled: {
    borderColor: COLORS.textSecondary,
    opacity: 0.5,
  },
  micHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  chatInputContainer: {
    marginBottom: 16,
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chatInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  quickPromptsScroll: {
    marginTop: 8,
  },
  quickPromptsContent: {
    paddingRight: 20,
    gap: 10,
  },
  quickPrompt: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickPromptPressed: {
    opacity: 0.7,
  },
  quickPromptText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
