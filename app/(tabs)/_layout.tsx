import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { BookOpen, Mic, BarChart2, Settings } from 'lucide-react-native';

const GOLD = '#d4a954';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 34 : 20,
          left: 20,
          right: 20,
          backgroundColor: 'rgba(22, 34, 53, 0.95)',
          borderRadius: 32,
          height: 64,
          paddingBottom: 0,
          paddingTop: 0,
          paddingHorizontal: 8,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 20,
        },
        tabBarActiveTintColor: GOLD,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarShowLabel: false,
      }}
      initialRouteName="index"
    >
      {/* Library Tab */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <View className={`p-2.5 rounded-2xl ${focused ? 'bg-primary/15' : ''}`}>
              <BookOpen size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />

      {/* Coach Tab */}
      <Tabs.Screen
        name="coach"
        options={{
          title: 'Coach',
          tabBarIcon: ({ color, focused }) => (
            <View className={`p-2.5 rounded-2xl ${focused ? 'bg-primary/15' : ''}`}>
              <Mic size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />

      {/* Pause Tab (Home - Center) */}
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View className="items-center justify-center -mt-6">
              {/* Outer glow */}
              {focused && (
                <View
                  className="absolute w-20 h-20 rounded-full"
                  style={{
                    backgroundColor: 'rgba(212, 169, 84, 0.25)',
                  }}
                />
              )}
              {/* Main button */}
              <View
                className={`w-14 h-14 rounded-full items-center justify-center border-2 ${
                  focused
                    ? 'bg-primary border-primary'
                    : 'bg-surface-dark border-primary/50'
                }`}
                style={focused ? {
                  shadowColor: GOLD,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.6,
                  shadowRadius: 12,
                  elevation: 10,
                } : undefined}
              >
                {/* Inner orb */}
                <View
                  className={`w-5 h-5 rounded-full ${
                    focused ? 'bg-background-dark' : 'bg-primary'
                  }`}
                />
              </View>
            </View>
          ),
        }}
      />

      {/* Progress Tab */}
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <View className={`p-2.5 rounded-2xl ${focused ? 'bg-primary/15' : ''}`}>
              <BarChart2 size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View className={`p-2.5 rounded-2xl ${focused ? 'bg-primary/15' : ''}`}>
              <Settings size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
