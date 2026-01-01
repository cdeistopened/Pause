import { View, Text, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';

const FOCUS_OPTIONS = [
  {
    id: 'anxiety',
    label: 'Reduce Anxiety',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    id: 'focus',
    label: 'Improve Focus',
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
  },
  {
    id: 'energy',
    label: 'Build Energy',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  },
  {
    id: 'thoughts',
    label: 'Manage Thoughts',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800',
  },
];

export default function FocusScreen() {
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
        {/* Header */}
        <View className="px-5 pt-4 pb-3">
          <Text className="text-2xl font-bold text-text-primary text-center mb-2">
            What brings you to The Pause?
          </Text>
          <Text className="text-base text-text-secondary text-center">
            Select your primary focus
          </Text>
        </View>

        {/* Cards */}
        <View className="flex-1 px-4 gap-3">
          {FOCUS_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              className={`flex-1 rounded-2xl overflow-hidden border-2 ${
                selected === option.id ? 'border-primary' : 'border-transparent'
              }`}
              onPress={() => setSelected(option.id)}
            >
              <ImageBackground
                source={{ uri: option.image }}
                className="flex-1"
                imageStyle={{ borderRadius: 14 }}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0, 0, 0, 0.7)']}
                  className="flex-1 flex-row items-end justify-between p-4"
                >
                  <Text className="text-xl font-bold text-text-primary flex-1">
                    {option.label}
                  </Text>
                  <Pressable
                    className={`px-4 py-2.5 rounded-full ${
                      selected === option.id
                        ? 'bg-primary'
                        : 'bg-white/20 border border-white/30'
                    }`}
                    onPress={() => setSelected(option.id)}
                  >
                    {selected === option.id ? (
                      <View className="flex-row items-center gap-1.5">
                        <Check size={16} color="#0A0E1A" strokeWidth={3} />
                        <Text className="text-sm font-bold text-background-dark">Selected</Text>
                      </View>
                    ) : (
                      <Text className="text-sm font-semibold text-text-primary">Select</Text>
                    )}
                  </Pressable>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        {/* Progress indicator */}
        <View className="flex-row justify-center gap-2 py-4">
          <View className="w-8 h-1.5 rounded-full bg-primary/50" />
          <View className="w-8 h-1.5 rounded-full bg-primary" />
          <View className="w-8 h-1.5 rounded-full bg-white/20" />
          <View className="w-8 h-1.5 rounded-full bg-white/20" />
        </View>

        {/* Footer */}
        <View className="flex-row gap-4 px-5 pb-6">
          <Pressable
            className="flex-1 h-14 rounded-full bg-white/10 flex-row items-center justify-center gap-2 border border-white/10 active:opacity-80"
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color="#F0F4F8" />
            <Text className="text-base font-semibold text-text-primary">Back</Text>
          </Pressable>

          <Pressable
            className={`flex-1 rounded-full overflow-hidden active:scale-[0.98] ${!selected && 'opacity-50'}`}
            onPress={() => router.push('/(onboarding)/notifications')}
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
