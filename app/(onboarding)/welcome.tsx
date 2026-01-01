import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(onboarding)/name');
  };

  const handleLogin = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <View className="flex-1 bg-background-dark">
      {/* Background gradient */}
      <LinearGradient
        colors={['#2a4561', '#0A0E1A', '#0A0E1A']}
        locations={[0, 0.4, 1]}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-1 px-6 justify-between">
          {/* Spacer */}
          <View className="h-6" />

          {/* Hero Image */}
          <View className="flex-1 max-h-[45%] items-center justify-center">
            {/* Glow behind image */}
            <View className="absolute w-[90vw] h-[90vw] rounded-full bg-primary/20 blur-2xl opacity-60" />

            <View className="w-full aspect-[4/5] max-h-[420px] rounded-2xl overflow-hidden bg-[#221c11] border border-white/5">
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvCDDLCeEwtinwRlbFVBWcuBxv1zFaLfamxvYjMpto_6iNlwGjehZGQTPmSkrBEP9yG6XozRuJjoHmsDpL3uQWtiyvnCNNXNl-HpkxUFwBa0Jb50Nvx4sRondkCr9ROxbFw55BNGeOcb5xBvuFaHtwcliAN3LaDkT7qCKku5vENCrPNmh71rTf0hJ2nMFyS4JFlzM0NWaYYFtir2AE9Yd-hyqd0GZ4ok4HjK-L3Lbwn8bxhH0ACtu1UgVnbrHSt7ypWytTow59L4U' }}
                className="w-full h-full opacity-90"
                resizeMode="cover"
              />
              {/* Gradient overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(10, 14, 26, 0.8)']}
                className="absolute bottom-0 left-0 right-0 h-2/5"
              />
            </View>
          </View>

          {/* Text Content */}
          <View className="items-center py-6">
            <Text className="text-4xl font-extrabold text-text-primary text-center tracking-tight leading-[42px]">
              Welcome to{'\n'}
              <Text className="text-primary">The Pause</Text>
            </Text>
            <Text className="text-lg font-light text-text-secondary text-center mt-6 leading-7 italic opacity-90 tracking-wide px-2">
              "Pause, breathe, and reconnect with your inner self. Your journey to mindfulness begins here."
            </Text>
          </View>

          {/* Actions */}
          <View className="gap-5 pb-4">
            <Pressable
              className="rounded-xl overflow-hidden active:opacity-90 active:scale-[0.98]"
              onPress={handleGetStarted}
            >
              <LinearGradient
                colors={['#d4a954', '#b8923f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center justify-center h-14 gap-2"
              >
                <Text className="text-lg font-bold text-background-dark tracking-wide">
                  Get Started
                </Text>
                <ArrowRight size={20} color="#0A0E1A" strokeWidth={2.5} />
              </LinearGradient>
            </Pressable>

            <Text className="text-sm font-medium text-text-secondary/70 text-center">
              Already have an account?{' '}
              <Text
                className="text-primary underline"
                onPress={handleLogin}
              >
                Log in
              </Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
