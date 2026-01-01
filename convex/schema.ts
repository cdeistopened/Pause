import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profile and settings
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),

    // Subscription
    subscriptionTier: v.union(v.literal("free"), v.literal("premium")),
    subscriptionExpiresAt: v.optional(v.number()),
    revenueCatUserId: v.optional(v.string()),

    // Preferences
    hapticEnabled: v.boolean(),
    morningReminderTime: v.optional(v.string()), // "09:00"
    eveningReminderTime: v.optional(v.string()), // "20:00"

    // Onboarding
    onboardingCompleted: v.boolean(),

    // Stats
    totalPauses: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.optional(v.string()), // "2024-12-16"

    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // User's selected habits with individual settings
  userHabits: defineTable({
    userId: v.id("users"),
    habitType: v.string(), // "breathing", "golden_light", "hydration", etc.

    // Goals
    dailyGoal: v.number(), // e.g., 10 for breathing

    // Reminders
    reminderEnabled: v.boolean(),
    reminderMode: v.union(
      v.literal("fixed_times"),
      v.literal("interval"),
      v.literal("none")
    ),
    reminderTimes: v.optional(v.array(v.string())), // ["09:00", "12:00", "15:00"]
    reminderIntervalHours: v.optional(v.number()), // e.g., 1
    activeHoursStart: v.optional(v.string()), // "08:00"
    activeHoursEnd: v.optional(v.string()), // "21:00"

    // Ordering
    priority: v.number(), // 1, 2, 3 for top 3

    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "habitType"]),

  // Daily habit completion logs
  habitLogs: defineTable({
    userId: v.id("users"),
    habitType: v.string(),
    date: v.string(), // "2024-12-16"
    completedCount: v.number(), // incremented each time
    completedAt: v.array(v.number()), // timestamps of each completion
  })
    .index("by_user_and_date", ["userId", "date"])
    .index("by_user_habit_date", ["userId", "habitType", "date"]),

  // Individual pause/exercise sessions
  sessions: defineTable({
    userId: v.id("users"),
    exerciseType: v.string(), // "breathing", "golden_light", etc.
    contentId: v.optional(v.id("content")), // if played from library
    durationSeconds: v.number(),
    completed: v.boolean(),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "completedAt"]),

  // Intentions logged after pauses
  intentions: defineTable({
    userId: v.id("users"),
    sessionId: v.optional(v.id("sessions")),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Content library (exercises and lectures)
  content: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("exercise"), v.literal("lecture")),
    exerciseType: v.optional(v.string()), // "breathing", etc. for exercises
    durationSeconds: v.number(),
    audioUrl: v.string(), // Convex file storage URL
    thumbnailUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_exercise_type", ["exerciseType"]),

  // Coach conversation history (for context)
  coachMessages: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    action: v.optional(v.object({
      type: v.string(),
      params: v.optional(v.any()),
    })),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
