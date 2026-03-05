import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Award, Info, X } from 'lucide-react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#D4A853',
  primaryGlow: 'rgba(212, 168, 83, 0.6)',
  background: '#0E1A2A',
  surface: '#162235',
  surfaceHighlight: '#1e2c42',
  dotEmpty: '#2E3A4D',
  textPrimary: '#F0F4F8',
  textSecondary: '#8A9BB5',
  border: 'rgba(255, 255, 255, 0.05)',
};

const DOT_COLUMNS = 20;
const DOT_SIZE = (SCREEN_WIDTH - 48 - (DOT_COLUMNS - 1) * 8) / DOT_COLUMNS;
const YEAR_GOAL = 365;
const TOTAL_DOTS = Math.ceil(YEAR_GOAL / DOT_COLUMNS) * DOT_COLUMNS;

function BigNumber({ value }: { value: number }) {
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.bigNumberContainer}>
      <Animated.View style={[styles.bigNumberGlow, glowStyle]} />
      <Text style={styles.bigNumber}>{value}</Text>
      <Text style={styles.bigNumberLabel}>Your Pauses (lifetime practices)</Text>
    </View>
  );
}

function DotGrid({ filled, total }: { filled: number; total: number }) {
  return (
    <View style={styles.dotGridContainer}>
      <View style={styles.dotGrid}>
        {Array.from({ length: total }).map((_, index) => {
          const isFilled = index < filled;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: isFilled ? COLORS.primary : COLORS.dotEmpty },
                isFilled && styles.dotFilled,
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.dotGridLabel}>365 pauses this year</Text>
    </View>
  );
}

function StatCard({
  icon,
  value,
  unit,
  label,
  delay = 0,
}: {
  icon: React.ReactNode;
  value: number;
  unit: string;
  label: string;
  delay?: number;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(400)}
      style={styles.statCard}
    >
      {/* Background glow */}
      <View style={styles.statCardGlow} />

      {/* Icon */}
      <View style={styles.statCardIconContainer}>
        <View style={styles.statCardIcon}>{icon}</View>
      </View>

      {/* Content */}
      <View style={styles.statCardContent}>
        <Text style={styles.statCardValue}>
          {value} <Text style={styles.statCardUnit}>{unit}</Text>
        </Text>
        <Text style={styles.statCardLabel}>{label}</Text>
      </View>
    </Animated.View>
  );
}

export default function ProgressScreen() {
  const [showIntentionList, setShowIntentionList] = useState(false);

  const user = useQuery(api.users.getCurrent);
  const intentionCount = useQuery(api.intentions.getCount);
  const intentions = useQuery(api.intentions.list, { limit: 50 });

  const isLoading = user === undefined;
  const totalPauses = user?.totalPauses ?? 0;

  // Mock streak data (would come from backend)
  const currentStreak = Math.min(totalPauses, 47);
  const longestStreak = Math.max(currentStreak, 89);

  const handleViewIntentions = useCallback(() => {
    Haptics.selectionAsync();
    setShowIntentionList(true);
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Progress</Text>
          <Pressable style={styles.infoButton}>
            <Info size={20} color={COLORS.primary} />
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Big Number */}
            <Animated.View entering={FadeIn.duration(600)}>
              <BigNumber value={totalPauses} />
            </Animated.View>

            {/* Dot Grid */}
            <Animated.View entering={FadeInUp.delay(100).duration(500)}>
              <DotGrid filled={totalPauses} total={TOTAL_DOTS} />
            </Animated.View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <StatCard
                icon={<Flame size={24} color={COLORS.primary} />}
                value={currentStreak}
                unit="days"
                label="Current streak"
                delay={200}
              />
              <StatCard
                icon={<Award size={24} color={COLORS.primary} />}
                value={longestStreak}
                unit="days"
                label="Longest streak"
                delay={300}
              />
            </View>

            {/* Intentions Card */}
            <Animated.View entering={FadeInUp.delay(400).duration(400)}>
              <Pressable
                style={({ pressed }) => [
                  styles.intentionsCard,
                  pressed && styles.intentionsCardPressed,
                ]}
                onPress={handleViewIntentions}
              >
                <View style={styles.intentionsContent}>
                  <Text style={styles.intentionsIcon}>✦</Text>
                  <View style={styles.intentionsText}>
                    <Text style={styles.intentionsTitle}>
                      {intentionCount ?? 0} intentions set
                    </Text>
                    <Text style={styles.intentionsSubtitle}>
                      View your intentions
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Intentions Modal */}
      <Modal
        visible={showIntentionList}
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Intentions</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowIntentionList(false)}
              >
                <X size={20} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
            >
              {intentions && intentions.length > 0 ? (
                intentions.map((intention) => (
                  <View key={intention._id} style={styles.intentionItem}>
                    <Text style={styles.intentionText}>{intention.text}</Text>
                    <Text style={styles.intentionDate}>
                      {new Date(intention.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    No intentions yet.{'\n'}Complete a pause to set your first intention.
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerSpacer: {
    width: 48,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  infoButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  bigNumberContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  bigNumberGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    top: -40,
  },
  bigNumber: {
    fontSize: 112,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -4,
    lineHeight: 112,
    textShadowColor: COLORS.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  bigNumberLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  dotGridContainer: {
    marginBottom: 32,
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotFilled: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  dotGridLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    height: 160,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statCardGlow: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${COLORS.primary}1A`,
  },
  statCardIconContainer: {
    zIndex: 1,
  },
  statCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardContent: {
    zIndex: 1,
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  statCardUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  statCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  intentionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  intentionsCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  intentionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intentionsIcon: {
    fontSize: 24,
    color: COLORS.primary,
    marginRight: 16,
  },
  intentionsText: {
    flex: 1,
  },
  intentionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  intentionsSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
  },
  intentionItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  intentionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  intentionDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
