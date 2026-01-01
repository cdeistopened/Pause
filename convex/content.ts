import { query, mutation, internalMutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";

// Helper to get user (read-only)
async function getUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
}

// Get all content (exercises and lectures)
export const list = query({
  args: {
    type: v.optional(v.union(v.literal("exercise"), v.literal("lecture"))),
    exerciseType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const isPremium = user?.subscriptionTier === "premium";

    let contentQuery;

    if (args.exerciseType) {
      contentQuery = ctx.db
        .query("content")
        .withIndex("by_exercise_type", (q) => q.eq("exerciseType", args.exerciseType));
    } else if (args.type) {
      contentQuery = ctx.db
        .query("content")
        .withIndex("by_type", (q) => q.eq("type", args.type));
    } else {
      contentQuery = ctx.db.query("content");
    }

    const content = await contentQuery.collect();

    // Sort by sortOrder and filter premium if needed
    return content
      .filter((item) => !item.isPremium || isPremium)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

// Get content by ID
export const getById = query({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    const isPremium = user?.subscriptionTier === "premium";

    const content = await ctx.db.get(args.contentId);
    if (!content) return null;

    // Check premium access
    if (content.isPremium && !isPremium) {
      return { ...content, audioUrl: null, locked: true };
    }

    return { ...content, locked: false };
  },
});

// Get exercises grouped by type
export const getExercisesByType = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    const isPremium = user?.subscriptionTier === "premium";

    const exercises = await ctx.db
      .query("content")
      .withIndex("by_type", (q) => q.eq("type", "exercise"))
      .collect();

    // Group by exerciseType
    const grouped: Record<string, typeof exercises> = {};

    for (const exercise of exercises) {
      if (exercise.isPremium && !isPremium) continue;
      const type = exercise.exerciseType ?? "other";
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(exercise);
    }

    // Sort each group
    for (const type in grouped) {
      grouped[type].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return grouped;
  },
});

// Get lectures
export const getLectures = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    const isPremium = user?.subscriptionTier === "premium";

    const lectures = await ctx.db
      .query("content")
      .withIndex("by_type", (q) => q.eq("type", "lecture"))
      .collect();

    return lectures
      .filter((item) => !item.isPremium || isPremium)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

// Add content (internal - for seeding/admin)
export const addContent = internalMutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("exercise"), v.literal("lecture")),
    exerciseType: v.optional(v.string()),
    durationSeconds: v.number(),
    audioUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    isPremium: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Seed initial content (internal - run once)
export const seedContent = internalMutation({
  handler: async (ctx) => {
    const existingContent = await ctx.db.query("content").first();
    if (existingContent) {
      return { message: "Content already seeded" };
    }

    const exercises = [
      {
        title: "Diaphragmatic Breathing",
        description: "Settle your nervous system with deep belly breathing. Feel your hand rise and fall.",
        type: "exercise" as const,
        exerciseType: "breathing",
        durationSeconds: 60,
        audioUrl: "/audio/breathing-60s.mp3",
        isPremium: false,
        sortOrder: 1,
      },
      {
        title: "Golden Light Visualization",
        description: "Fill yourself with healing golden light from head to toe.",
        type: "exercise" as const,
        exerciseType: "golden_light",
        durationSeconds: 90,
        audioUrl: "/audio/golden-light-90s.mp3",
        isPremium: false,
        sortOrder: 2,
      },
      {
        title: "Counting Practice",
        description: "Change the channel on racing thoughts by focusing on counting.",
        type: "exercise" as const,
        exerciseType: "counting",
        durationSeconds: 30,
        audioUrl: "/audio/counting-30s.mp3",
        isPremium: false,
        sortOrder: 3,
      },
      {
        title: "Progressive Relaxation",
        description: "Release tension from each part of your body, one by one.",
        type: "exercise" as const,
        exerciseType: "relaxation",
        durationSeconds: 120,
        audioUrl: "/audio/relaxation-120s.mp3",
        isPremium: false,
        sortOrder: 4,
      },
      {
        title: "Positive Self-Talk",
        description: "Practice speaking kindly to yourself. Your mind listens.",
        type: "exercise" as const,
        exerciseType: "self_talk",
        durationSeconds: 60,
        audioUrl: "/audio/self-talk-60s.mp3",
        isPremium: false,
        sortOrder: 5,
      },
    ];

    for (const exercise of exercises) {
      await ctx.db.insert("content", {
        ...exercise,
        createdAt: Date.now(),
      });
    }

    return { message: "Content seeded successfully", count: exercises.length };
  },
});
