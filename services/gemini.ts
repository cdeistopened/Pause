/**
 * Gemini LLM Service for Voice Coach
 *
 * Handles all LLM calls for the Dr. Miller voice coach feature.
 * Uses Gemini 2.0 Flash (gemini-2.0-flash) for fast inference.
 */

// Types
export interface CoachAction {
  type: 'START_EXERCISE' | 'PLAY_CONTENT' | 'CAPTURE_INTENTION' | 'SET_HABIT' | 'SHOW_PROGRESS' | 'SHOW_HABITS';
  id?: string;
  text?: string;
  frequency?: number;
}

export interface CoachResponse {
  message: string;
  action: CoachAction | null;
}

export interface UserContext {
  name?: string;
  todayProgress?: Record<string, { done: number; goal: number }>;
  currentStreak?: number;
  lastIntention?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

// System prompt - Dr. Miller's voice coach persona
const SYSTEM_PROMPT = `You are Dr. Richard Louis Miller, an 85-year-old clinical psychologist with 64 years of practice. You guide people to take control of their minds through The Pause app.

CORE PHILOSOPHY (use these phrases naturally):
- "You are the boss of your mind."
- "A little over time is a lot."
- "Practice, practice, practice."
- "Change the channel" when negative thoughts intrude.
- "Check in with yourself."
- "Good health is worth fighting for."

YOUR ROLE: Interactive coach, not lecturer. You guide through DOING, not explaining. When users share struggles, you:
1. Acknowledge briefly
2. Recommend an app exercise OR guide a reframe
3. Keep them moving forward

STYLE:
- Warm but direct. No fluff.
- 1-2 sentences max per response.
- ONE action or ONE question. Never both.
- End conversations with intention-setting when appropriate.

THE APP'S 5 EXERCISES (recommend these):
- BREATHING: "Let's settle you down. 60 seconds of diaphragmatic breathing—feet on the floor, hand on your belly. Ready?"
- GOLDEN_LIGHT: "Fill yourself up with golden light, and you'll have the energy to make it through the day. Let's do it."
- COUNTING: "When thoughts won't stop, we change the channel. Focus on counting for 30 seconds. It works."
- RELAXATION: "Time to release that tension. A quick relaxation exercise will help."
- SELF_TALK: "Your mind listens to everything you say. Let's practice saying something positive about yourself."

WHEN TO USE EACH:
- Anxiety/stress/overwhelm → BREATHING first
- Low energy/need motivation → GOLDEN_LIGHT
- Racing thoughts/can't focus → COUNTING
- Physical tension/can't sleep → RELAXATION
- Self-criticism/negativity → SELF_TALK reframe, then exercise

SELF-TALK REFRAMING PATTERN:
When user criticizes themselves:
1. "I hear that. Now tell me one thing you did well today, even something small."
2. After they respond: "That's not nothing. Try saying: '[positive reframe]' out loud."
3. Capture as intention.

HABIT GUIDANCE:
- Start small: "How about 3 times a day to start? We can adjust."
- Reinforce: "You've done [X] breathing sessions this week. That's building real skill."
- Morning/afternoon/evening anchors work best.

NEVER:
- Give medical or therapeutic advice
- Lecture or explain at length
- Let conversation drift from practice
- Respond without guiding toward action

RESPONSE FORMAT (JSON only, no markdown):
{
  "message": "Your spoken response",
  "action": { "type": "ACTION_TYPE", "id": "exercise_id" } or null
}

ACTIONS:
- START_EXERCISE: breathing | golden_light | counting | relaxation | self_talk
- PLAY_CONTENT: [content_id] - Only if user explicitly asks to learn more
- CAPTURE_INTENTION: { "type": "CAPTURE_INTENTION", "text": "user's intention" }
- SET_HABIT: { "type": "SET_HABIT", "id": "habit_id", "frequency": number }
- SHOW_PROGRESS: { "type": "SHOW_PROGRESS" }
- SHOW_HABITS: { "type": "SHOW_HABITS" }
- null: Continue conversation`;

/**
 * Build context string from user data
 */
function buildUserContext(context: UserContext): string {
  const parts: string[] = [];

  if (context.name) {
    parts.push(`User's name: ${context.name}`);
  }

  parts.push(`Time of day: ${context.timeOfDay}`);

  if (context.currentStreak && context.currentStreak > 0) {
    parts.push(`Current streak: ${context.currentStreak} days`);
  }

  if (context.todayProgress) {
    const progressLines = Object.entries(context.todayProgress)
      .map(([habit, { done, goal }]) => `${habit}: ${done}/${goal}`)
      .join(', ');
    parts.push(`Today's progress: ${progressLines}`);
  }

  if (context.lastIntention) {
    parts.push(`Last intention: "${context.lastIntention}"`);
  }

  return parts.join('\n');
}

/**
 * Parse LLM response into structured CoachResponse
 */
function parseResponse(text: string): CoachResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        message: parsed.message || "I'm here. What's on your mind?",
        action: parsed.action || null,
      };
    }
  } catch (e) {
    console.warn('Failed to parse coach response as JSON:', e);
  }

  // Fallback: treat entire response as message
  return {
    message: text.trim() || "I'm here. What's on your mind?",
    action: null,
  };
}

/**
 * Get time of day based on current hour
 */
export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Call Gemini API with the coach prompt
 */
export async function getCoachResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'model'; content: string }> = [],
  userContext?: Partial<UserContext>
): Promise<CoachResponse> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('EXPO_PUBLIC_GEMINI_API_KEY not configured');
  }

  // Build full context
  const context: UserContext = {
    timeOfDay: getTimeOfDay(),
    ...userContext,
  };

  const contextString = buildUserContext(context);

  // Build messages array
  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: userMessage },
  ];

  // Gemini API endpoint
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    })),
    systemInstruction: {
      parts: [{ text: `${SYSTEM_PROMPT}\n\nUSER CONTEXT:\n${contextString}` }],
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 256,
      topP: 0.9,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extract text from Gemini response
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return parseResponse(responseText);
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw error;
  }
}

/**
 * Simple test function to verify the service works
 */
export async function testCoachResponse(): Promise<void> {
  console.log('Testing Gemini coach response...\n');

  const testMessages = [
    "I'm feeling really anxious about work today",
    "I can't stop my mind from racing",
    "I'm so stupid, I keep making mistakes",
    "I need more energy",
    "How am I doing?",
  ];

  for (const message of testMessages) {
    console.log(`User: "${message}"`);
    try {
      const response = await getCoachResponse(message);
      console.log(`Coach: "${response.message}"`);
      if (response.action) {
        console.log(`Action: ${JSON.stringify(response.action)}`);
      }
      console.log('---\n');
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
