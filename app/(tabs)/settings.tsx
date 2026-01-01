import { View, Text, ScrollView, Pressable, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ChevronRight, Plus, ExternalLink } from 'lucide-react-native';

const USER_HABITS = [
  { id: 'breathing', name: 'Breathing', icon: '🌬️', reminderSummary: '10x daily' },
  { id: 'golden_light', name: 'Golden Light', icon: '✨', reminderSummary: 'Once daily' },
  { id: 'hydration', name: 'Hydration', icon: '💧', reminderSummary: '8x daily' },
];

export default function SettingsScreen() {
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const subscriptionTier = 'free';

  const openBookingLink = () => {
    Linking.openURL('https://calendly.com/dr-miller/consultation');
  };

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1 px-5 pt-3" contentContainerStyle={{ paddingBottom: 120 }}>
          <Text className="text-text-primary text-2xl font-bold mb-6">Settings</Text>

          {/* Notifications */}
          <Text className="text-text-secondary/60 text-xs font-semibold tracking-wide mb-2 mt-4">
            NOTIFICATIONS
          </Text>
          <View className="bg-surface-dark rounded-2xl overflow-hidden">
            <Pressable className="flex-row items-center justify-between p-4">
              <Text className="text-text-primary text-base">Morning check-in</Text>
              <View className="flex-row items-center">
                <Text className="text-text-secondary text-base mr-1">9:00 AM</Text>
                <ChevronRight size={20} color="#5A6B7D" />
              </View>
            </Pressable>
            <View className="h-px bg-white/10 ml-4" />
            <Pressable className="flex-row items-center justify-between p-4">
              <Text className="text-text-primary text-base">Evening reflection</Text>
              <View className="flex-row items-center">
                <Text className="text-text-secondary text-base mr-1">8:00 PM</Text>
                <ChevronRight size={20} color="#5A6B7D" />
              </View>
            </Pressable>
          </View>

          {/* My Habits */}
          <Text className="text-text-secondary/60 text-xs font-semibold tracking-wide mb-2 mt-6">
            MY HABITS
          </Text>
          <View className="bg-surface-dark rounded-2xl overflow-hidden">
            {USER_HABITS.map((habit, index) => (
              <View key={habit.id}>
                {index > 0 && <View className="h-px bg-white/10 ml-4" />}
                <Pressable className="flex-row items-center p-4">
                  <Text className="text-2xl mr-3">{habit.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-text-primary text-base">{habit.name}</Text>
                    <Text className="text-text-secondary text-sm mt-0.5">
                      Reminders: {habit.reminderSummary}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-text-secondary/60 text-sm mr-1">Edit</Text>
                    <ChevronRight size={16} color="#5A6B7D" />
                  </View>
                </Pressable>
              </View>
            ))}
            <View className="h-px bg-white/10 ml-4" />
            <Pressable className="flex-row items-center p-4">
              <Plus size={20} color="#d4a954" />
              <Text className="text-primary text-base ml-2">Add Habit</Text>
            </Pressable>
          </View>

          {/* Preferences */}
          <Text className="text-text-secondary/60 text-xs font-semibold tracking-wide mb-2 mt-6">
            PREFERENCES
          </Text>
          <View className="bg-surface-dark rounded-2xl overflow-hidden">
            <View className="flex-row items-center justify-between p-4">
              <Text className="text-text-primary text-base">Haptics</Text>
              <Switch
                value={hapticEnabled}
                onValueChange={setHapticEnabled}
                trackColor={{ false: '#1F2937', true: '#d4a954' }}
                thumbColor="#F0F4F8"
              />
            </View>
          </View>

          {/* Account */}
          <Text className="text-text-secondary/60 text-xs font-semibold tracking-wide mb-2 mt-6">
            ACCOUNT
          </Text>
          <View className="bg-surface-dark rounded-2xl overflow-hidden">
            <Pressable className="flex-row items-center justify-between p-4">
              <Text className="text-text-primary text-base">Subscription</Text>
              <View className="flex-row items-center">
                <Text className="text-text-secondary text-base mr-2">Free</Text>
                <Text className="text-primary font-medium mr-1">Upgrade</Text>
                <ChevronRight size={20} color="#d4a954" />
              </View>
            </Pressable>
            <View className="h-px bg-white/10 ml-4" />
            <Pressable className="flex-row items-center justify-between p-4">
              <Text className="text-text-primary text-base">Restore purchases</Text>
              <ChevronRight size={20} color="#5A6B7D" />
            </Pressable>
          </View>

          {/* Dr. Miller */}
          <Text className="text-text-secondary/60 text-xs font-semibold tracking-wide mb-2 mt-6">
            DR. MILLER
          </Text>
          <View className="bg-surface-dark rounded-2xl overflow-hidden">
            <Pressable className="flex-row items-center justify-between p-4" onPress={openBookingLink}>
              <Text className="text-text-primary text-base">Work with Dr. Miller directly</Text>
              <ExternalLink size={18} color="#5A6B7D" />
            </Pressable>
          </View>

          {/* About */}
          <Text className="text-text-secondary/60 text-xs font-semibold tracking-wide mb-2 mt-6">
            ABOUT
          </Text>
          <View className="bg-surface-dark rounded-2xl overflow-hidden">
            <View className="p-4">
              <Text className="text-text-primary text-base">Version</Text>
              <Text className="text-text-secondary text-sm mt-1">1.0.0</Text>
            </View>
            <View className="h-px bg-white/10 ml-4" />
            <View className="p-4">
              <Text className="text-text-secondary text-sm">
                Created by Dr. Richard Louis Miller
              </Text>
            </View>
            <View className="h-px bg-white/10 ml-4" />
            <View className="flex-row items-center p-4">
              <Pressable>
                <Text className="text-text-secondary text-sm">Terms of Service</Text>
              </Pressable>
              <Text className="text-text-secondary/40 mx-2">|</Text>
              <Pressable>
                <Text className="text-text-secondary text-sm">Privacy Policy</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
