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

// Add a new intention
export const add = mutation({
  args: {
    text: v.string(),
    sessionId: v.optional(v.id("sessions")),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const intentionId = await ctx.db.insert("intentions", {
      userId: user._id,
      sessionId: args.sessionId,
      text: args.text,
      createdAt: Date.now(),
    });

    return intentionId;
  },
});

// Get user's intentions
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const limit = args.limit ?? 20;

    const intentions = await ctx.db
      .query("intentions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(limit);

    return intentions;
  },
});

// Get the most recent intention
export const getLatest = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("intentions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();
  },
});

// Update an intention
export const update = mutation({
  args: {
    intentionId: v.id("intentions"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const intention = await ctx.db.get(args.intentionId);
    if (!intention || intention.userId !== user._id) {
      throw new Error("Intention not found");
    }

    await ctx.db.patch(args.intentionId, { text: args.text });
  },
});

export const remove = mutation({
  args: {
    intentionId: v.id("intentions"),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const intention = await ctx.db.get(args.intentionId);
    if (!intention || intention.userId !== user._id) {
      throw new Error("Intention not found");
    }

    await ctx.db.delete(args.intentionId);
  },
});

export const getCount = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return 0;

    const intentions = await ctx.db
      .query("intentions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return intentions.length;
  },
});
