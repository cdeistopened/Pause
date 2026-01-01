import { View, Text, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Flame, Settings } from 'lucide-react-native';
import { ExerciseCategoryId, getContextualSuggestion, EXERCISE_CATEGORIES } from '@/constants/exercises';
import { GoldenOrb } from '@/components/pause/GoldenOrb';
import { RadialSelector } from '@/components/pause/RadialSelector';
import { ActiveSession } from '@/components/pause/ActiveSession';
import { IntentionScreen } from '@/components/pause/IntentionScreen';
import { router } from 'expo-router';

const GOLD = '#d4a954';
const ORB_SIZE = 160;

export default function PauseScreen() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showIntention, setShowIntention] = useState(false);
  const { recommendedExercise } = getContextualSuggestion();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseCategoryId>(recommendedExercise);

  const selectedCategory = EXERCISE_CATEGORIES.find(c => c.id === selectedExercise);
  const streakCount = 7; // TODO: Get from backend

  const handleOrbLongPress = () => {
    setIsSessionActive(true);
  };

  const handleSessionClose = () => {
    setIsSessionActive(false);
  };

  const handleSessionComplete = () => {
    setIsSessionActive(false);
    setShowIntention(true);
  };

  const handleIntentionComplete = (intention: string) => {
    console.log('Intention saved:', intention);
    setShowIntention(false);
  };

  const handleIntentionSkip = () => {
    setShowIntention(false);
  };

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
          <Pressable className="flex-row items-center bg-surface-dark/60 px-3 py-1.5 rounded-full">
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
            onPress={() => router.push('/settings')}
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
              onSelect={setSelectedExercise}
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
          prompt="Breathe in the golden light..."
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
