import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, User } from 'lucide-react-native';

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  return (
    <View className="flex-1 bg-background-dark">
      {/* Background gradient */}
      <LinearGradient
        colors={['#1a2a3a', '#0A0E1A', '#0A0E1A']}
        locations={[0, 0.3, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 pt-16">
          {/* Icon */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center border border-primary/30">
              <User size={36} color="#d4a954" strokeWidth={1.5} />
            </View>
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-text-primary text-center mb-3">
            What's your name?
          </Text>
          <Text className="text-base text-text-secondary text-center mb-10 leading-6">
            We'll use this to personalize your experience
          </Text>

          {/* Input */}
          <View className="bg-surface-dark rounded-2xl border border-white/10 overflow-hidden">
            <TextInput
              className="px-5 py-5 text-lg text-text-primary"
              placeholder="Enter your name"
              placeholderTextColor="#8A9BB5"
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
            />
          </View>

          {/* Progress indicator */}
          <View className="flex-row justify-center gap-2 mt-8">
            <View className="w-8 h-1.5 rounded-full bg-primary" />
            <View className="w-8 h-1.5 rounded-full bg-white/20" />
            <View className="w-8 h-1.5 rounded-full bg-white/20" />
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
            className={`flex-1 rounded-full overflow-hidden active:scale-[0.98] ${!name && 'opacity-50'}`}
            onPress={() => router.push('/(onboarding)/focus')}
            disabled={!name}
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
