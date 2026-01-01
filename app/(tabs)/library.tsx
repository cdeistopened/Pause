import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Play, Lock, Wind, Sun, Hash, MessageCircle, Smile } from 'lucide-react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ActiveSession } from '@/components/pause/ActiveSession';
import { IntentionScreen } from '@/components/pause/IntentionScreen';
import * as Haptics from 'expo-haptics';

type ContentType = 'exercises' | 'learn';

// Map exercise types to icons
const EXERCISE_ICONS: Record<string, React.ReactNode> = {
  breathing: <Wind size={28} color="#d4a954" />,
  golden_light: <Sun size={28} color="#d4a954" />,
  counting: <Hash size={28} color="#d4a954" />,
  self_talk: <MessageCircle size={28} color="#d4a954" />,
  relaxation: <Smile size={28} color="#d4a954" />,
};

// Fallback content when backend is not available
const FALLBACK_EXERCISES = [
  { id: '1', title: 'Diaphragmatic Breathing', duration: 90, exerciseType: 'breathing', isPremium: false, description: 'Settle your nervous system with deep belly breathing.' },
  { id: '2', title: 'Golden Light Visualization', duration: 90, exerciseType: 'golden_light', isPremium: false, description: 'Fill yourself with healing golden light.' },
  { id: '3', title: 'Counting Focus', duration: 60, exerciseType: 'counting', isPremium: false, description: 'Change the channel on racing thoughts.' },
  { id: '4', title: 'Positive Self-Talk', duration: 60, exerciseType: 'self_talk', isPremium: false, description: 'Practice speaking kindly to yourself.' },
  { id: '5', title: 'Progressive Relaxation', duration: 120, exerciseType: 'relaxation', isPremium: false, description: 'Release tension from your body.' },
];

const FALLBACK_LECTURES = [
  { id: 'l1', title: 'Setting Your Mood', duration: 240, isPremium: true, description: 'Learn to take control of your emotional state.' },
  { id: 'l2', title: 'Saturation Learning', duration: 300, isPremium: true, description: 'The power of repeated exposure.' },
  { id: 'l3', title: 'Overcoming Self-Criticism', duration: 240, isPremium: true, description: 'Be your own best friend.' },
  { id: 'l4', title: 'Movement & Well-Being', duration: 180, isPremium: true, description: 'The body-mind connection.' },
  { id: 'l5', title: 'Staying Present', duration: 240, isPremium: true, description: 'The art of being here now.' },
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

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<ContentType>('exercises');
  const [selectedExercise, setSelectedExercise] = useState<SelectedExercise | null>(null);
  const [showIntention, setShowIntention] = useState(false);

  // Backend queries (will return undefined if Convex not connected)
  const backendContent = useQuery(api.content.list, { type: activeTab === 'exercises' ? 'exercise' : 'lecture' });
  const createSession = useMutation(api.sessions.create);
  const incrementPauseCount = useMutation(api.users.incrementPauseCount);
  const addIntention = useMutation(api.intentions.add);

  // Use backend content or fallback
  const content = backendContent ?? (activeTab === 'exercises' ? FALLBACK_EXERCISES : FALLBACK_LECTURES);

  const handlePlayPress = useCallback((item: (typeof content)[number]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if ('exerciseType' in item && item.exerciseType) {
      const duration = 'durationSeconds' in item
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

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-5 pt-3 pb-5">
          <Text className="text-text-primary text-2xl font-bold">Library</Text>
        </View>

        {/* Tab Filter - iOS segment control style with underline */}
        <View className="flex-row px-5 mb-5 border-b border-white/10">
          <Pressable
            className={`px-4 py-3 ${
              activeTab === 'exercises' ? 'border-b-2 border-primary' : ''
            }`}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('exercises');
            }}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === 'exercises' ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              Exercises
            </Text>
          </Pressable>
          <Pressable
            className={`px-4 py-3 ${
              activeTab === 'learn' ? 'border-b-2 border-primary' : ''
            }`}
            onPress={() => {
              Haptics.selectionAsync();
              setActiveTab('learn');
            }}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === 'learn' ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              Learn
            </Text>
          </Pressable>
        </View>

        {/* Content List */}
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
          {content.map((item) => {
            const exerciseType = 'exerciseType' in item ? item.exerciseType : undefined;
            const duration = 'durationSeconds' in item
              ? (item as { durationSeconds: number }).durationSeconds
              : (item as { duration: number }).duration;
            const isPremium = item.isPremium;
            const icon = exerciseType ? EXERCISE_ICONS[exerciseType] : null;
            const itemId = '_id' in item ? String(item._id) : (item as { id: string }).id;

            return (
              <Pressable
                key={itemId}
                className="flex-row items-center justify-between bg-surface-dark rounded-2xl p-4 mb-3 border border-white/5 active:opacity-80"
                onPress={() => !isPremium && handlePlayPress(item)}
                disabled={isPremium}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-xl bg-background-dark items-center justify-center mr-3">
                    {icon || <Text className="text-2xl">🎓</Text>}
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary text-base font-medium mb-0.5">
                      {item.title}
                    </Text>
                    <Text className="text-text-secondary text-sm">
                      {formatDuration(duration)} • {activeTab === 'exercises' ? 'Exercise' : 'Mini-Lecture'}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3">
                  {isPremium && <Lock size={16} color="#9333EA" />}
                  <Pressable
                    className={`w-11 h-11 rounded-full items-center justify-center ${
                      isPremium ? 'bg-background-dark/50' : 'bg-primary/20'
                    }`}
                    onPress={() => !isPremium && handlePlayPress(item)}
                    disabled={isPremium}
                  >
                    <Play size={18} color={isPremium ? '#666' : '#d4a954'} fill={isPremium ? '#666' : '#d4a954'} />
                  </Pressable>
                </View>
              </Pressable>
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
            prompt={selectedExercise.description || "Focus on your breath..."}
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
