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

// Save a coach message
export const saveMessage = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    action: v.optional(
      v.object({
        type: v.string(),
        params: v.optional(v.any()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const messageId = await ctx.db.insert("coachMessages", {
      userId: user._id,
      role: args.role,
      content: args.content,
      action: args.action,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Get coach conversation history
export const getHistory = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const limit = args.limit ?? 50;

    const messages = await ctx.db
      .query("coachMessages")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("asc")
      .take(limit);

    return messages;
  },
});

// Get recent messages for context (last N messages)
export const getRecentContext = query({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const count = args.count ?? 10;

    // Get messages in desc order then reverse for context
    const messages = await ctx.db
      .query("coachMessages")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(count);

    return messages.reverse();
  },
});

// Clear conversation history
export const clearHistory = mutation({
  handler: async (ctx) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const messages = await ctx.db
      .query("coachMessages")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    return { deleted: messages.length };
  },
});

// Save both user message and assistant response in one call
export const saveConversation = mutation({
  args: {
    userMessage: v.string(),
    assistantMessage: v.string(),
    action: v.optional(
      v.object({
        type: v.string(),
        params: v.optional(v.any()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const user = await ensureUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const now = Date.now();

    // Save user message
    await ctx.db.insert("coachMessages", {
      userId: user._id,
      role: "user",
      content: args.userMessage,
      createdAt: now,
    });

    // Save assistant message
    await ctx.db.insert("coachMessages", {
      userId: user._id,
      role: "assistant",
      content: args.assistantMessage,
      action: args.action,
      createdAt: now + 1, // Ensure ordering
    });
  },
});
