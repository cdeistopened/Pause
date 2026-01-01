import { View, Text, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useCallback } from 'react';
import { Flame, Settings } from 'lucide-react-native';
import { ExerciseCategoryId, getContextualSuggestion, EXERCISE_CATEGORIES } from '@/constants/exercises';
import { GoldenOrb } from '@/components/pause/GoldenOrb';
import { RadialSelector } from '@/components/pause/RadialSelector';
import { ActiveSession } from '@/components/pause/ActiveSession';
import { IntentionScreen } from '@/components/pause/IntentionScreen';
import { router } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as Haptics from 'expo-haptics';

const GOLD = '#d4a954';
const ORB_SIZE = 160;

// Map exercise category IDs to backend exercise types
const EXERCISE_TYPE_MAP: Record<ExerciseCategoryId, string> = {
  breath: 'breathing',
  light: 'golden_light',
  count: 'counting',
  talk: 'self_talk',
  relax: 'relaxation',
};

// Exercise prompts
const EXERCISE_PROMPTS: Record<ExerciseCategoryId, string> = {
  breath: 'Breathe in through your nose... and out through your mouth...',
  light: 'Imagine golden light filling you from head to toe...',
  count: 'Focus on counting slowly... changing the channel...',
  talk: 'Speak kindly to yourself... your mind is listening...',
  relax: 'Release the tension... let each muscle relax...',
};

export default function PauseScreen() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showIntention, setShowIntention] = useState(false);
  const { recommendedExercise } = getContextualSuggestion();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseCategoryId>(recommendedExercise);

  // Backend queries
  const user = useQuery(api.users.getCurrent);
  const createSession = useMutation(api.sessions.create);
  const incrementPauseCount = useMutation(api.users.incrementPauseCount);
  const addIntention = useMutation(api.intentions.add);

  const selectedCategory = EXERCISE_CATEGORIES.find(c => c.id === selectedExercise);
  const streakCount = user?.currentStreak ?? 0;

  const handleExerciseSelect = useCallback((exerciseId: ExerciseCategoryId) => {
    Haptics.selectionAsync();
    setSelectedExercise(exerciseId);
  }, []);

  const handleOrbLongPress = useCallback(() => {
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
      // Record session in backend
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
    setShowIntention(true);
  }, [selectedExercise, selectedCategory, createSession, incrementPauseCount]);

  const handleIntentionComplete = useCallback(async (intention: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      await addIntention({ text: intention });
    } catch (e) {
      console.log('Failed to save intention:', e);
    }

    setShowIntention(false);
  }, [addIntention]);

  const handleIntentionSkip = useCallback(() => {
    setShowIntention(false);
  }, []);

  const handleSettingsPress = useCallback(() => {
    Haptics.selectionAsync();
    router.push('/settings');
  }, []);

  return (
    <View className="flex-1 bg-background-dark">
      {/* Background gradient */}
      <LinearGradient
        colors={['#1a2a3a', '#0f1822', '#0A0E1A']}
        locations={[0, 0.4, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header Row */}
        <View className="flex-row items-center justify-between px-5 pt-3">
          {/* Streak Counter */}
          <Pressable
            className="flex-row items-center bg-surface-dark/60 px-3 py-1.5 rounded-full"
            onPress={() => Haptics.selectionAsync()}
          >
            <Flame size={16} color={GOLD} fill={GOLD} />
            <Text
              className="text-sm font-bold ml-1.5"
              style={{ color: GOLD }}
            >
              {streakCount}
            </Text>
          </Pressable>

          {/* Settings Button */}
          <Pressable
            className="w-10 h-10 rounded-full bg-surface-dark/60 items-center justify-center"
            onPress={handleSettingsPress}
          >
            <Settings size={20} color="#8A9BB5" />
          </Pressable>
        </View>

        {/* Main Content - Centered Orb with Radial Selector */}
        <View className="flex-1 items-center justify-center">
          {/* Container for orb + radial selector */}
          <View className="items-center justify-center">
            {/* Radial selector (positions exercises around the orb) */}
            <RadialSelector
              selected={selectedExercise}
              onSelect={handleExerciseSelect}
              orbSize={ORB_SIZE}
            />

            {/* Golden Orb - positioned at center of RadialSelector */}
            <View
              style={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GoldenOrb
                size={ORB_SIZE}
                onLongPress={handleOrbLongPress}
              />
            </View>
          </View>

          {/* Hold to begin text */}
          <View className="mt-8 items-center">
            <Text
              className="text-base font-medium"
              style={{
                color: GOLD,
                textShadowColor: 'rgba(212, 169, 84, 0.5)',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              Hold to begin
            </Text>
          </View>
        </View>
      </SafeAreaView>

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

      {/* Intention Screen Modal */}
      <Modal
        visible={showIntention}
        animationType="fade"
        statusBarTranslucent
      >
        <IntentionScreen
          onComplete={handleIntentionComplete}
          onSkip={handleIntentionSkip}
        />
      </Modal>
    </View>
  );
}
