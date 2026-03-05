import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

interface IntentionSheetProps {
  onSave: (intention: string) => void;
  onClose: () => void;
}

const GOLD = '#d4a954';

export function IntentionSheet({ onSave, onClose }: IntentionSheetProps) {
  const [intention, setIntention] = useState('');

  const sanitizedIntention = intention.trim();
  const hasIntention = sanitizedIntention.length > 0;

  const handleSave = useCallback(() => {
    if (!hasIntention) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSave(sanitizedIntention);
  }, [hasIntention, sanitizedIntention, onSave]);

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  }, [onClose]);

  return (
    <View className="flex-1" style={{ backgroundColor: '#050302' }}>
      <LinearGradient
        colors={['#1a1408', '#0a0805', '#050302']}
        locations={[0, 0.4, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <View className="flex-row items-center justify-between px-5 pt-3">
            <View className="w-10" />
            <Text className="text-white text-lg font-semibold">Set intention</Text>
            <Pressable
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              onPress={handleClose}
            >
              <X size={20} color="rgba(255, 255, 255, 0.7)" />
            </Pressable>
          </View>

          <View className="flex-1 px-6 pt-8">
            <Text className="text-gray-400 text-base mb-4">
              What will you carry forward?
            </Text>

            <TextInput
              className="w-full rounded-2xl text-white text-lg px-5 py-4"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderWidth: 1,
                borderColor: hasIntention ? GOLD : 'rgba(255, 255, 255, 0.1)',
                minHeight: 120,
              }}
              placeholder="Type your intention..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={intention}
              onChangeText={setIntention}
              multiline
              textAlignVertical="top"
              autoFocus
              maxLength={500}
            />
          </View>

          <View className="px-6 pb-6">
            <Pressable
              className="w-full rounded-full overflow-hidden active:scale-[0.98]"
              onPress={handleSave}
              disabled={!hasIntention}
              style={{
                opacity: hasIntention ? 1 : 0.5,
                shadowColor: GOLD,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: hasIntention ? 0.3 : 0,
                shadowRadius: 15,
                elevation: hasIntention ? 8 : 0,
              }}
            >
              <LinearGradient
                colors={hasIntention ? ['#d4a954', '#b8923f'] : ['#555', '#444']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-14 items-center justify-center"
              >
                <Text
                  className="text-lg font-bold tracking-wide"
                  style={{ color: hasIntention ? '#0a0805' : '#999' }}
                >
                  Save
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
