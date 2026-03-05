import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, ArrowRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const COLORS = {
  primary: '#EBB305',
  primaryLight: '#FCD34D',
  background: '#0A0E1A',
  inputBg: '#1F2937',
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
};

interface IntentionScreenProps {
  onComplete: (intention: string) => void;
  onSkip: () => void;
}

export function IntentionScreen({ onComplete, onSkip }: IntentionScreenProps) {
  const [intention, setIntention] = useState('');
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.2);

  const sanitizedIntention = intention.trim().slice(0, 500);
  const hasIntention = sanitizedIntention.length > 0;

  useEffect(() => {
    // Pulsing glow animation
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [glowScale, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const handleComplete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (hasIntention) {
      onComplete(sanitizedIntention);
    } else {
      onSkip();
    }
  }, [hasIntention, sanitizedIntention, onComplete, onSkip]);

  const handleSkip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkip();
  }, [onSkip]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Success Icon Section */}
          <Animated.View
            entering={FadeIn.duration(600)}
            style={styles.successSection}
          >
            <View style={styles.checkContainer}>
              {/* Pulsing glow */}
              <Animated.View style={[styles.checkGlow, glowStyle]} />

              {/* Check circle */}
              <View style={styles.checkCircle}>
                <Check size={48} color={COLORS.primary} strokeWidth={3} />
              </View>
            </View>

            <Text style={styles.headline}>Pause complete</Text>
          </Animated.View>

          {/* Intention Input Section */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(600)}
            style={styles.inputSection}
          >
            <Text style={styles.prompt}>What will you carry forward?</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.textInput,
                  hasIntention && styles.textInputActive,
                ]}
                placeholder="Type your intention..."
                placeholderTextColor={`${COLORS.textMuted}B3`}
                value={intention}
                onChangeText={setIntention}
                multiline
                textAlignVertical="top"
                autoFocus
                maxLength={500}
              />
            </View>
          </Animated.View>

          {/* Actions Section */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.actionsSection}
          >
            <Pressable
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.doneButtonPressed,
              ]}
              onPress={handleComplete}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>

            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
              <ArrowRight size={18} color={`${COLORS.primary}E6`} />
            </Pressable>
          </Animated.View>
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
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  successSection: {
    alignItems: 'center',
  },
  checkContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  checkGlow: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS.primary,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.background}80`,
    borderWidth: 3,
    borderColor: `${COLORS.primary}66`,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  inputSection: {
    flex: 1,
    marginTop: 16,
  },
  prompt: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    fontSize: 20,
    color: COLORS.textPrimary,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  textInputActive: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 25,
  },
  actionsSection: {
    alignItems: 'center',
    gap: 24,
    marginTop: 32,
  },
  doneButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  doneButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.background,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: `${COLORS.primary}E6`,
  },
});
