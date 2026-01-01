import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Sun, Moon, ArrowLeft, ArrowRight } from 'lucide-react-native';

const TIME_OPTIONS = [
  { id: 'morning', label: 'Morning', time: '8:00 AM', Icon: Sun },
  { id: 'evening', label: 'Evening', time: '8:00 PM', Icon: Moon },
  { id: 'both', label: 'Both', time: '8AM & 8PM', Icon: Bell },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-background-dark">
      {/* Background gradient */}
      <LinearGradient
        colors={['#1a2a3a', '#0A0E1A', '#0A0E1A']}
        locations={[0, 0.3, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-12">
          {/* Icon */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center border border-primary/30">
              <Bell size={42} color="#d4a954" strokeWidth={1.5} />
            </View>
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-text-primary text-center mb-3">
            When should we remind you?
          </Text>
          <Text className="text-base text-text-secondary text-center mb-10 leading-6">
            Set a daily check-in time for your pause practice
          </Text>

          {/* Options */}
          <View className="gap-3">
            {TIME_OPTIONS.map((option) => {
              const Icon = option.Icon;
              const isSelected = selected === option.id;
              return (
                <Pressable
                  key={option.id}
                  className={`flex-row items-center p-5 rounded-2xl border-2 gap-4 ${
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface-dark border-white/10'
                  }`}
                  onPress={() => setSelected(option.id)}
                >
                  <Icon
                    size={28}
                    color={isSelected ? '#d4a954' : '#8A9BB5'}
                    strokeWidth={1.5}
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-text-primary">
                      {option.label}
                    </Text>
                    <Text className="text-sm text-text-secondary mt-0.5">
                      {option.time}
                    </Text>
                  </View>
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected ? 'border-primary' : 'border-text-secondary/50'
                    }`}
                  >
                    {isSelected && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Skip link */}
          <Pressable
            className="mt-6 py-3"
            onPress={() => router.push('/(onboarding)/ready')}
          >
            <Text className="text-base text-text-secondary text-center underline">
              Skip for now
            </Text>
          </Pressable>

          {/* Progress indicator */}
          <View className="flex-row justify-center gap-2 mt-8">
            <View className="w-8 h-1.5 rounded-full bg-primary/50" />
            <View className="w-8 h-1.5 rounded-full bg-primary/50" />
            <View className="w-8 h-1.5 rounded-full bg-primary" />
            <View className="w-8 h-1.5 rounded-full bg-white/20" />
          </View>
        </View>

        {/* Footer */}
        <View className="flex-row gap-4 px-6 pb-6">
          <Pressable
            className="flex-1 h-14 rounded-full bg-white/10 flex-row items-center justify-center gap-2 border border-white/10 active:opacity-80"
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color="#F0F4F8" />
            <Text className="text-base font-semibold text-text-primary">Back</Text>
          </Pressable>

          <Pressable
            className={`flex-1 rounded-full overflow-hidden active:scale-[0.98] ${!selected && 'opacity-50'}`}
            onPress={() => router.push('/(onboarding)/ready')}
            disabled={!selected}
          >
            <LinearGradient
              colors={['#d4a954', '#b8923f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 flex-row items-center justify-center gap-2"
            >
              <Text className="text-base font-bold text-background-dark">Continue</Text>
              <ArrowRight size={18} color="#0A0E1A" />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
