import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Play, Lock } from 'lucide-react-native';

type ContentType = 'exercises' | 'learn';

const EXERCISES = [
  { id: '1', title: 'Diaphragmatic Breathing', duration: '90 sec', icon: '🌬️', isPremium: false },
  { id: '2', title: 'Golden Light Visualization', duration: '5 min', icon: '✨', isPremium: false },
  { id: '3', title: 'Counting Focus', duration: '60 sec', icon: '🔢', isPremium: false },
  { id: '4', title: 'Positive Self-Talk', duration: '60 sec', icon: '💭', isPremium: true },
  { id: '5', title: 'Progressive Relaxation', duration: '5 min', icon: '😌', isPremium: true },
];

const LECTURES = [
  { id: '1', title: 'Setting Your Mood', duration: '4 min', icon: '🎓', isPremium: true },
  { id: '2', title: 'Saturation Learning', duration: '5 min', icon: '🎓', isPremium: true },
  { id: '3', title: 'Overcoming Self-Criticism', duration: '4 min', icon: '🎓', isPremium: true },
  { id: '4', title: 'Movement & Well-Being', duration: '3 min', icon: '🎓', isPremium: true },
  { id: '5', title: 'Staying Present', duration: '4 min', icon: '🎓', isPremium: true },
];

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<ContentType>('exercises');
  const content = activeTab === 'exercises' ? EXERCISES : LECTURES;

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-5 pt-3 pb-5">
          <Text className="text-text-primary text-2xl font-bold">Library</Text>
        </View>

        {/* Tab Filter */}
        <View className="flex-row px-5 mb-5 gap-3">
          <Pressable
            className={`px-5 py-2.5 rounded-full ${
              activeTab === 'exercises' ? 'bg-primary' : 'bg-surface-dark'
            }`}
            onPress={() => setActiveTab('exercises')}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === 'exercises' ? 'text-background-dark' : 'text-text-secondary'
              }`}
            >
              Exercises
            </Text>
          </Pressable>
          <Pressable
            className={`px-5 py-2.5 rounded-full ${
              activeTab === 'learn' ? 'bg-primary' : 'bg-surface-dark'
            }`}
            onPress={() => setActiveTab('learn')}
          >
            <Text
              className={`text-sm font-semibold ${
                activeTab === 'learn' ? 'text-background-dark' : 'text-text-secondary'
              }`}
            >
              Learn
            </Text>
          </Pressable>
        </View>

        {/* Content List */}
        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 100 }}>
          {content.map((item) => (
            <Pressable
              key={item.id}
              className="flex-row items-center justify-between bg-surface-dark rounded-2xl p-4 mb-3 border border-white/5"
            >
              <View className="flex-row items-center flex-1">
                <Text className="text-3xl mr-3">{item.icon}</Text>
                <View className="flex-1">
                  <Text className="text-text-primary text-base font-medium mb-0.5">
                    {item.title}
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    {item.duration} • {activeTab === 'exercises' ? 'Exercise' : 'Mini-Lecture'}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                {item.isPremium && <Lock size={16} color="#9333EA" />}
                <View className="w-10 h-10 rounded-full bg-background-dark items-center justify-center">
                  <Play size={16} color="#d4a954" fill="#d4a954" />
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
