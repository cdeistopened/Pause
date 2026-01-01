import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { ensureUser } from "./users";

// Helper to get user (read-only)
async function getUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
}

// Get all user's habits
export const list = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const habits = await ctx.db
      .query("userHabits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return habits.sort((a, b) => a.priority - b.priority);
  },
});

// Add a new habit
export const add = mutation({
  args: {
    habitType: v.string(),
    dailyGoal: v.number(),
    reminderEnabled: v.optional(v.boolean()),
    reminderMode: v.optional(v.union(v.literal("fixed_times"), v.literal("interval"), v.literal("none"))),
    reminderTimes: v.optional(v.array(v.string())),
    reminderIntervalHours: v.optional(v.number()),
    activeHoursStart: v.optional(v.string()),
    activeHoursEnd: v.optional(v.string()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if habit already exists
    const existing = await ctx.db
      .query("userHabits")
      .withIndex("by_user_and_type", (q) => q.eq("userId", user._id).eq("habitType", args.habitType))
      .first();

    if (existing) {
      throw new Error("Habit already exists");
    }

    // Get next priority if not specified
    let priority = args.priority;
    if (priority === undefined) {
      const habits = await ctx.db
        .query("userHabits")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
      priority = habits.length + 1;
    }

    const habitId = await ctx.db.insert("userHabits", {
      userId: user._id,
      habitType: args.habitType,
      dailyGoal: args.dailyGoal,
      reminderEnabled: args.reminderEnabled ?? false,
      reminderMode: args.reminderMode ?? "none",
      reminderTimes: args.reminderTimes,
      reminderIntervalHours: args.reminderIntervalHours,
      activeHoursStart: args.activeHoursStart,
      activeHoursEnd: args.activeHoursEnd,
      priority,
      createdAt: Date.now(),
    });

    return habitId;
  },
});

// Update a habit
export const update = mutation({
  args: {
    habitId: v.id("userHabits"),
    dailyGoal: v.optional(v.number()),
    reminderEnabled: v.optional(v.boolean()),
    reminderMode: v.optional(v.union(v.literal("fixed_times"), v.literal("interval"), v.literal("none"))),
    reminderTimes: v.optional(v.array(v.string())),
    reminderIntervalHours: v.optional(v.number()),
    activeHoursStart: v.optional(v.string()),
    activeHoursEnd: v.optional(v.string()),
    priority: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new Error("Habit not found");
    }

    const updates: Record<string, unknown> = {};
    if (args.dailyGoal !== undefined) updates.dailyGoal = args.dailyGoal;
    if (args.reminderEnabled !== undefined) updates.reminderEnabled = args.reminderEnabled;
    if (args.reminderMode !== undefined) updates.reminderMode = args.reminderMode;
    if (args.reminderTimes !== undefined) updates.reminderTimes = args.reminderTimes;
    if (args.reminderIntervalHours !== undefined) updates.reminderIntervalHours = args.reminderIntervalHours;
    if (args.activeHoursStart !== undefined) updates.activeHoursStart = args.activeHoursStart;
    if (args.activeHoursEnd !== undefined) updates.activeHoursEnd = args.activeHoursEnd;
    if (args.priority !== undefined) updates.priority = args.priority;

    await ctx.db.patch(args.habitId, updates);
  },
});

// Remove a habit
export const remove = mutation({
  args: {
    habitId: v.id("userHabits"),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new Error("Habit not found");
    }

    await ctx.db.delete(args.habitId);
  },
});

// Log a habit completion
export const logCompletion = mutation({
  args: {
    habitType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const now = Date.now();

    // Find or create today's log
    const existingLog = await ctx.db
      .query("habitLogs")
      .withIndex("by_user_habit_date", (q) =>
        q.eq("userId", user._id).eq("habitType", args.habitType).eq("date", today)
      )
      .first();

    if (existingLog) {
      // Update existing log
      await ctx.db.patch(existingLog._id, {
        completedCount: existingLog.completedCount + 1,
        completedAt: [...existingLog.completedAt, now],
      });
      return existingLog._id;
    } else {
      // Create new log
      const logId = await ctx.db.insert("habitLogs", {
        userId: user._id,
        habitType: args.habitType,
        date: today,
        completedCount: 1,
        completedAt: [now],
      });
      return logId;
    }
  },
});

// Get today's habit progress
export const getTodayProgress = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return {};

    const today = new Date().toISOString().split("T")[0];

    // Get user's habits
    const habits = await ctx.db
      .query("userHabits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Get today's logs
    const logs = await ctx.db
      .query("habitLogs")
      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id).eq("date", today))
      .collect();

    // Build progress map
    const progress: Record<string, { done: number; goal: number }> = {};

    for (const habit of habits) {
      const log = logs.find((l) => l.habitType === habit.habitType);
      progress[habit.habitType] = {
        done: log?.completedCount ?? 0,
        goal: habit.dailyGoal,
      };
    }

    return progress;
  },
});

// Get habit logs for a date range
export const getLogsByDateRange = query({
  args: {
    habitType: v.optional(v.string()),
    startDate: v.string(), // "YYYY-MM-DD"
    endDate: v.string(), // "YYYY-MM-DD"
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    let query = ctx.db
      .query("habitLogs")
      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id));

    const logs = await query.collect();

    // Filter by date range and optionally by habit type
    return logs.filter((log) => {
      const inRange = log.date >= args.startDate && log.date <= args.endDate;
      const matchesType = !args.habitType || log.habitType === args.habitType;
      return inRange && matchesType;
    });
  },
});

// Get habit by type
export const getByType = query({
  args: {
    habitType: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("userHabits")
      .withIndex("by_user_and_type", (q) => q.eq("userId", user._id).eq("habitType", args.habitType))
      .first();
  },
});
