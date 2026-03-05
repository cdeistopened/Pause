import { View, Text, Modal, Pressable, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useCallback } from 'react';
import { Menu, Settings } from 'lucide-react-native';
import { ExerciseCategoryId, getContextualSuggestion, EXERCISE_CATEGORIES } from '@/constants/exercises';
import { GoldenOrb } from '@/components/pause/GoldenOrb';
import { SegmentedControl } from '@/components/pause/SegmentedControl';
import { ActiveSession } from '@/components/pause/ActiveSession';
import { CompletionCard } from '@/components/pause/CompletionCard';
import { IntentionSheet } from '@/components/pause/IntentionSheet';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primary: '#d4a954',
  primaryLight: '#f3d08c',
  background: '#0A0E1A',
  backgroundGradient: '#1a2236',
  textMuted: 'rgba(255, 255, 255, 0.4)',
  surfaceLight: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(255, 255, 255, 0.1)',
};

const ORB_SIZE = 192;

const EXERCISE_TYPE_MAP: Record<ExerciseCategoryId, string> = {
  breath: 'breathing',
  light: 'golden_light',
  count: 'counting',
  relax: 'relaxation',
};

const EXERCISE_PROMPTS: Record<ExerciseCategoryId, string> = {
  breath: 'Breathe in through your nose... and out through your mouth...',
  light: 'Imagine golden light filling you from head to toe...',
  count: 'Focus on counting slowly... changing the channel...',
  relax: 'Release the tension... let each muscle relax...',
};

const SEGMENT_OPTIONS = [
  { id: 'breath', label: 'Breathing' },
  { id: 'light', label: 'Light' },
  { id: 'count', label: 'Count' },
];

export default function PauseScreen() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showIntentionSheet, setShowIntentionSheet] = useState(false);
  const { recommendedExercise } = getContextualSuggestion();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseCategoryId>(recommendedExercise);

  const createSession = useMutation(api.sessions.create);
  const incrementPauseCount = useMutation(api.users.incrementPauseCount);
  const addIntention = useMutation(api.intentions.add);

  const selectedCategory = EXERCISE_CATEGORIES.find(c => c.id === selectedExercise);

  const handleExerciseSelect = useCallback((exerciseId: string) => {
    Haptics.selectionAsync();
    setSelectedExercise(exerciseId as ExerciseCategoryId);
  }, []);

  const handleStartSession = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsSessionActive(true);
  }, []);

  const handleSessionClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSessionActive(false);
  }, []);

  const handleSessionComplete = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const exerciseType = EXERCISE_TYPE_MAP[selectedExercise];
      await createSession({
        exerciseType,
        durationSeconds: selectedCategory?.defaultDuration || 90,
        completed: true,
      });
      await incrementPauseCount();
    } catch (e) {
      console.log('Failed to record session:', e);
    }

    setIsSessionActive(false);
    setShowCompletion(true);
  }, [selectedExercise, selectedCategory, createSession, incrementPauseCount]);

  const handleCompletionDone = useCallback(() => {
    setShowCompletion(false);
  }, []);

  const handleAddIntention = useCallback(() => {
    setShowCompletion(false);
    setShowIntentionSheet(true);
  }, []);

  const handleIntentionSave = useCallback(async (intention: string) => {
    try {
      await addIntention({ text: intention });
    } catch (e) {
      console.log('Failed to save intention:', e);
    }
    setShowIntentionSheet(false);
  }, [addIntention]);

  const handleIntentionClose = useCallback(() => {
    setShowIntentionSheet(false);
  }, []);

  const formatDuration = (seconds: number): string => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (secs === 0) {
        return `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
      }
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  };

  const durationText = selectedCategory
    ? formatDuration(selectedCategory.defaultDuration)
    : '60 seconds';

  return (
    <View style={styles.container}>
      {/* Background gradient - radial from center */}
      <LinearGradient
        colors={[COLORS.backgroundGradient, COLORS.background]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Radial glow behind orb */}
      <View style={styles.radialGlowContainer}>
        <View style={styles.radialGlow} />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerButton}>
            <Menu size={22} color={COLORS.textMuted} />
          </Pressable>

          <Text style={styles.logoText}>PAUSE</Text>

          <Pressable style={styles.headerButton}>
            <Settings size={22} color={COLORS.textMuted} />
          </Pressable>
        </View>

        {/* Central Orb Section */}
        <View style={styles.orbSection}>
          <GoldenOrb
            size={ORB_SIZE}
            onPress={handleStartSession}
            onLongPress={handleStartSession}
          />

          {/* Headline and Duration */}
          <View style={styles.textContainer}>
            <Text style={styles.headline}>Take a Pause</Text>
            <Text style={styles.duration}>{durationText}</Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.controlsContainer}>
          {/* Exercise Selector */}
          <View style={styles.selectorWrapper}>
            <SegmentedControl
              options={SEGMENT_OPTIONS}
              selected={selectedExercise}
              onSelect={handleExerciseSelect}
            />
          </View>

          {/* Start Button */}
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.startButtonPressed,
            ]}
            onPress={handleStartSession}
          >
            <Text style={styles.startButtonText}>Start Session</Text>
            <View style={styles.startButtonOverlay} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Decorative particles */}
      <View style={[styles.particle, { top: '25%', left: 40 }]} />
      <View style={[styles.particle, styles.particleLarge, { top: '33%', right: 48 }]} />
      <View style={[styles.particle, { bottom: '25%', left: 80 }]} />
      <View style={[styles.particle, styles.particleGold, { bottom: '33%', right: '25%' }]} />

      {/* Active Session Modal */}
      <Modal
        visible={isSessionActive}
        animationType="fade"
        statusBarTranslucent
      >
        <ActiveSession
          exerciseName={selectedCategory?.name || 'Breath'}
          totalDuration={selectedCategory?.defaultDuration || 90}
          onClose={handleSessionClose}
          onComplete={handleSessionComplete}
          prompt={EXERCISE_PROMPTS[selectedExercise]}
        />
      </Modal>

      {/* Completion Modal */}
      <Modal
        visible={showCompletion}
        animationType="fade"
        statusBarTranslucent
      >
        <CompletionCard
          onDone={handleCompletionDone}
          onAddIntention={handleAddIntention}
        />
      </Modal>

      {/* Intention Sheet */}
      <Modal
        visible={showIntentionSheet}
        animationType="slide"
        statusBarTranslucent
      >
        <IntentionSheet
          onSave={handleIntentionSave}
          onClose={handleIntentionClose}
        />
      </Modal>
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
  radialGlowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // Offset to center on orb position
  },
  radialGlow: {
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: SCREEN_WIDTH * 0.6,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  orbSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    fontFamily: 'serif', // Will use Playfair Display when loaded
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  duration: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '300',
    opacity: 0.8,
    letterSpacing: 1,
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 32,
  },
  selectorWrapper: {
    maxWidth: 360,
    alignSelf: 'center',
    width: '100%',
  },
  startButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 320,
    alignSelf: 'center',
    width: '100%',
    overflow: 'hidden',
    // Shadow
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  startButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  startButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: '700',
  },
  startButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    opacity: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  particleLarge: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  particleGold: {
    backgroundColor: `${COLORS.primary}33`,
  },
});
