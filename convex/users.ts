import { query, mutation, internalMutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// Helper to get user (read-only)
async function getUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
    .first();
}

// Helper to ensure user exists (for mutations only)
export async function ensureUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  let user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", q => q.eq("clerkId", identity.subject))
    .first();

  // Auto-create user if doesn't exist with default values
  if (!user) {
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email,
      name: identity.name,
      subscriptionTier: "free",
      hapticEnabled: true,
      onboardingCompleted: false,
      totalPauses: 0,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: Date.now(),
    });
    user = await ctx.db.get(userId);
  }

  return user;
}

// Get current user
export const getCurrent = query({
  handler: async (ctx) => {
    return await getUser(ctx);
  },
});

// Update user preferences
export const updatePreferences = mutation({
  args: {
    hapticEnabled: v.optional(v.boolean()),
    morningReminderTime: v.optional(v.string()),
    eveningReminderTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const updates: Record<string, any> = {};
    if (args.hapticEnabled !== undefined) updates.hapticEnabled = args.hapticEnabled;
    if (args.morningReminderTime !== undefined) updates.morningReminderTime = args.morningReminderTime;
    if (args.eveningReminderTime !== undefined) updates.eveningReminderTime = args.eveningReminderTime;

    await ctx.db.patch(user._id, updates);
  },
});

// Complete onboarding
export const completeOnboarding = mutation({
  handler: async (ctx) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    await ctx.db.patch(user._id, { onboardingCompleted: true });
  },
});

// Update user stats (called after completing a pause)
export const incrementPauseCount = mutation({
  handler: async (ctx) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const today = new Date().toISOString().split('T')[0];
    const isNewDay = user.lastActiveDate !== today;

    // Calculate streak
    let newStreak = user.currentStreak;
    if (isNewDay) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        newStreak = user.currentStreak + 1;
      } else if (user.lastActiveDate !== today) {
        newStreak = 1; // Reset streak if not consecutive
      }
    }

    const longestStreak = Math.max(newStreak, user.longestStreak);

    await ctx.db.patch(user._id, {
      totalPauses: user.totalPauses + 1,
      currentStreak: newStreak,
      longestStreak,
      lastActiveDate: today,
    });

    return { newStreak, longestStreak };
  },
});

// Create or update user from Clerk webhook (internal only)
export const upsertFromClerk = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { clerkId, email, name }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { email, name });
      return existing._id;
    } else {
      return await ctx.db.insert("users", {
        clerkId,
        email,
        name,
        subscriptionTier: "free",
        hapticEnabled: true,
        onboardingCompleted: false,
        totalPauses: 0,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: Date.now(),
      });
    }
  },
});

// Delete user and all their data (internal only)
export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", q => q.eq("clerkId", clerkId))
      .first();

    if (!user) return;

    // Delete all user's habits
    const habits = await ctx.db
      .query("userHabits")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();
    for (const habit of habits) {
      await ctx.db.delete(habit._id);
    }

    // Delete all user's sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    // Delete all user's intentions
    const intentions = await ctx.db
      .query("intentions")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();
    for (const intention of intentions) {
      await ctx.db.delete(intention._id);
    }

    // Delete all user's coach messages
    const coachMessages = await ctx.db
      .query("coachMessages")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();
    for (const msg of coachMessages) {
      await ctx.db.delete(msg._id);
    }

    // Delete user
    await ctx.db.delete(user._id);
  },
});
