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

// Create a new session (called when pause/exercise completes)
export const create = mutation({
  args: {
    exerciseType: v.string(),
    durationSeconds: v.number(),
    contentId: v.optional(v.id("content")),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const sessionId = await ctx.db.insert("sessions", {
      userId: user._id,
      exerciseType: args.exerciseType,
      durationSeconds: args.durationSeconds,
      contentId: args.contentId,
      completed: args.completed,
      completedAt: Date.now(),
    });

    return sessionId;
  },
});

// Get user's recent sessions
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const limit = args.limit ?? 50;

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    return sessions;
  },
});

// Get sessions by date range
export const getByDateRange = query({
  args: {
    startDate: v.number(), // timestamp
    endDate: v.number(), // timestamp
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", user._id).gte("completedAt", args.startDate).lte("completedAt", args.endDate)
      )
      .order("desc")
      .collect();

    return sessions;
  },
});

// Get session by ID
export const getById = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return null;

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== user._id) return null;

    return session;
  },
});

// Get sessions grouped by exercise type (for progress view)
export const getStatsByExerciseType = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return {};

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Group by exercise type
    const stats: Record<string, { count: number; totalSeconds: number; completedCount: number }> = {};

    for (const session of sessions) {
      if (!stats[session.exerciseType]) {
        stats[session.exerciseType] = { count: 0, totalSeconds: 0, completedCount: 0 };
      }
      stats[session.exerciseType].count++;
      stats[session.exerciseType].totalSeconds += session.durationSeconds;
      if (session.completed) {
        stats[session.exerciseType].completedCount++;
      }
    }

    return stats;
  },
});

// Get today's sessions count (for progress dots)
export const getTodayCount = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", user._id).gte("completedAt", startOfDay)
      )
      .collect();

    return sessions.length;
  },
});
