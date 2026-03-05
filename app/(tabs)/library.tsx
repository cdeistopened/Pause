import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Lock, Wind, Sun, Hash, MessageCircle, Smile, BookOpen } from 'lucide-react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ActiveSession } from '@/components/pause/ActiveSession';
import { IntentionScreen } from '@/components/pause/IntentionScreen';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#d4a954',
  primaryLight: '#f3d08c',
  background: '#0A0E1A',
  surface: '#1A2B3C',
  surfaceHighlight: '#23364A',
  textPrimary: '#F0F4F8',
  textSecondary: '#8A9BB5',
  border: 'rgba(255, 255, 255, 0.05)',
  borderActive: 'rgba(212, 168, 83, 0.5)',
  premium: '#9333EA',
};

type ContentType = 'exercises' | 'learn';

const EXERCISE_ICONS: Record<string, { icon: typeof Wind; color: string }> = {
  breathing: { icon: Wind, color: '#4A90D9' },
  golden_light: { icon: Sun, color: '#D4A853' },
  counting: { icon: Hash, color: '#10B981' },
  self_talk: { icon: MessageCircle, color: '#8B5CF6' },
  relaxation: { icon: Smile, color: '#06B6D4' },
};

const FALLBACK_EXERCISES = [
  {
    id: '1',
    title: 'Diaphragmatic Breathing',
    duration: 90,
    exerciseType: 'breathing',
    isPremium: false,
    description: 'Settle your nervous system with deep belly breathing.',
  },
  {
    id: '2',
    title: 'Golden Light Visualization',
    duration: 90,
    exerciseType: 'golden_light',
    isPremium: false,
    description: 'Fill yourself with healing golden light.',
  },
  {
    id: '3',
    title: 'Counting Focus',
    duration: 60,
    exerciseType: 'counting',
    isPremium: false,
    description: 'Change the channel on racing thoughts.',
  },
  {
    id: '4',
    title: 'Positive Self-Talk',
    duration: 60,
    exerciseType: 'self_talk',
    isPremium: false,
    description: 'Practice speaking kindly to yourself.',
  },
  {
    id: '5',
    title: 'Progressive Relaxation',
    duration: 120,
    exerciseType: 'relaxation',
    isPremium: false,
    description: 'Release tension from your body.',
  },
];

const FALLBACK_LECTURES = [
  {
    id: 'l1',
    title: 'Setting Your Mood',
    duration: 240,
    isPremium: true,
    description: 'Learn to take control of your emotional state.',
  },
  {
    id: 'l2',
    title: 'Saturation Learning',
    duration: 300,
    isPremium: true,
    description: 'The power of repeated exposure.',
  },
  {
    id: 'l3',
    title: 'Overcoming Self-Criticism',
    duration: 240,
    isPremium: true,
    description: 'Be your own best friend.',
  },
  {
    id: 'l4',
    title: 'Movement & Well-Being',
    duration: 180,
    isPremium: true,
    description: 'The body-mind connection.',
  },
  {
    id: 'l5',
    title: 'Staying Present',
    duration: 240,
    isPremium: true,
    description: 'The art of being here now.',
  },
];

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins} min`;
}

interface SelectedExercise {
  title: string;
  duration: number;
  exerciseType: string;
  description?: string;
}

function ExerciseCard({
  title,
  duration,
  exerciseType,
  description,
  isPremium,
  onPress,
  index,
}: {
  title: string;
  duration: number;
  exerciseType?: string;
  description?: string;
  isPremium: boolean;
  onPress: () => void;
  index: number;
}) {
  const iconData = exerciseType ? EXERCISE_ICONS[exerciseType] : null;
  const IconComponent = iconData?.icon || BookOpen;
  const iconColor = iconData?.color || COLORS.primary;

  return (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(400)}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && !isPremium && styles.cardPressed,
          isPremium && styles.cardPremium,
        ]}
        onPress={onPress}
        disabled={isPremium}
      >
        {/* Icon */}
        <View style={[styles.cardIcon, { backgroundColor: `${iconColor}20` }]}>
          <IconComponent size={28} color={iconColor} />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          {description && (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {description}
            </Text>
          )}
          <View style={styles.cardMeta}>
            <Text style={styles.cardDuration}>{formatDuration(duration)}</Text>
            <View style={styles.cardDot} />
            <Text style={styles.cardType}>
              {exerciseType ? 'Exercise' : 'Mini-Lecture'}
            </Text>
          </View>
        </View>

        {/* Action */}
        <View style={styles.cardAction}>
          {isPremium && <Lock size={14} color={COLORS.premium} style={styles.lockIcon} />}
          <View
            style={[
              styles.playButton,
              isPremium && styles.playButtonDisabled,
            ]}
          >
            <Play
              size={18}
              color={isPremium ? COLORS.textSecondary : COLORS.primary}
              fill={isPremium ? COLORS.textSecondary : COLORS.primary}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<ContentType>('exercises');
  const [selectedExercise, setSelectedExercise] = useState<SelectedExercise | null>(null);
  const [showIntention, setShowIntention] = useState(false);

  const backendContent = useQuery(api.content.list, {
    type: activeTab === 'exercises' ? 'exercise' : 'lecture',
  });
  const createSession = useMutation(api.sessions.create);
  const incrementPauseCount = useMutation(api.users.incrementPauseCount);
  const addIntention = useMutation(api.intentions.add);

  const content =
    backendContent ?? (activeTab === 'exercises' ? FALLBACK_EXERCISES : FALLBACK_LECTURES);

  const handlePlayPress = useCallback((item: (typeof content)[number]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if ('exerciseType' in item && item.exerciseType) {
      const duration =
        'durationSeconds' in item
          ? (item as { durationSeconds: number }).durationSeconds
          : (item as { duration: number }).duration;

      setSelectedExercise({
        title: item.title,
        duration,
        exerciseType: item.exerciseType,
        description: item.description,
      });
    }
  }, []);

  const handleSessionClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExercise(null);
  }, []);

  const handleSessionComplete = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (selectedExercise) {
      try {
        await createSession({
          exerciseType: selectedExercise.exerciseType,
          durationSeconds: selectedExercise.duration,
          completed: true,
        });
        await incrementPauseCount();
      } catch (e) {
        console.log('Failed to record session:', e);
      }
    }

    setSelectedExercise(null);
    setShowIntention(true);
  }, [selectedExercise, createSession, incrementPauseCount]);

  const handleIntentionComplete = useCallback(
    async (intention: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        await addIntention({ text: intention });
      } catch (e) {
        console.log('Failed to save intention:', e);
      }

      setShowIntention(false);
    },
    [addIntention]
  );

  const handleIntentionSkip = useCallback(() => {
    setShowIntention(false);
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text style={styles.headerTitle}>Library</Text>
        </Animated.View>

        {/* Tab Filter */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'exercises' && styles.tabActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('exercises');
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'exercises' && styles.tabTextActive,
              ]}
            >
              Exercises
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'learn' && styles.tabActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('learn');
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'learn' && styles.tabTextActive,
              ]}
            >
              Learn
            </Text>
          </Pressable>
        </View>

        {/* Content List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content.map((item, index) => {
            const exerciseType = 'exerciseType' in item ? item.exerciseType : undefined;
            const duration =
              'durationSeconds' in item
                ? (item as { durationSeconds: number }).durationSeconds
                : (item as { duration: number }).duration;
            const isPremium = item.isPremium;
            const itemId = '_id' in item ? String(item._id) : (item as { id: string }).id;

            return (
              <ExerciseCard
                key={itemId}
                title={item.title}
                duration={duration}
                exerciseType={exerciseType}
                description={item.description}
                isPremium={isPremium}
                onPress={() => !isPremium && handlePlayPress(item)}
                index={index}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>

      {/* Active Session Modal */}
      {selectedExercise && (
        <Modal visible={true} animationType="fade" statusBarTranslucent>
          <ActiveSession
            exerciseName={selectedExercise.title}
            totalDuration={selectedExercise.duration}
            onClose={handleSessionClose}
            onComplete={handleSessionComplete}
            prompt={selectedExercise.description || 'Focus on your breath...'}
          />
        </Modal>
      )}

      {/* Intention Screen Modal */}
      <Modal visible={showIntention} animationType="fade" statusBarTranslucent>
        <IntentionScreen
          onComplete={handleIntentionComplete}
          onSkip={handleIntentionSkip}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    borderColor: COLORS.borderActive,
  },
  cardPremium: {
    opacity: 0.6,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDuration: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary,
  },
  cardDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textSecondary,
    marginHorizontal: 8,
  },
  cardType: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  cardAction: {
    alignItems: 'center',
  },
  lockIcon: {
    marginBottom: 6,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonDisabled: {
    backgroundColor: `${COLORS.textSecondary}15`,
  },
});
