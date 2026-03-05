import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { BookOpen, Mic, BarChart2, Settings } from 'lucide-react-native';

const COLORS = {
  gold: '#d4a954',
  goldFaded: 'rgba(212, 169, 84, 0.15)',
  goldGlow: 'rgba(212, 169, 84, 0.25)',
  inactive: 'rgba(255, 255, 255, 0.4)',
  tabBar: 'rgba(22, 34, 53, 0.95)',
  tabBarBorder: 'rgba(255, 255, 255, 0.08)',
  surface: '#1A2B3C',
  background: '#0A0E1A',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItem,
      }}
      initialRouteName="index"
    >
      {/* Library Tab */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
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
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
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
            <View style={styles.centerButtonContainer}>
              {/* Outer glow ring */}
              {focused && <View style={styles.centerButtonGlow} />}
              {/* Main button */}
              <View style={[styles.centerButton, focused && styles.centerButtonActive]}>
                {/* Inner orb */}
                <View style={[styles.centerButtonInner, focused && styles.centerButtonInnerActive]} />
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
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
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
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Settings size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.tabBar,
    borderRadius: 32,
    height: 64,
    paddingBottom: 0,
    paddingTop: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: COLORS.tabBarBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 16,
  },
  iconWrapperActive: {
    backgroundColor: COLORS.goldFaded,
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24, // Raises the center button above the tab bar
  },
  centerButtonGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.goldGlow,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: 'rgba(212, 169, 84, 0.5)',
  },
  centerButtonActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  centerButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
  },
  centerButtonInnerActive: {
    backgroundColor: COLORS.background,
  },
});
