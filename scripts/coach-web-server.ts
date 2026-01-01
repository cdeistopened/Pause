/**
 * Voice Coach Web Server with Gemini 3 + ElevenLabs TTS
 *
 * Run with: npx tsx scripts/coach-web-server.ts
 * Then open: http://localhost:3333
 */

import * as http from 'http';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const PORT = 3333;

// Load Dr. Miller Knowledge Base
const KNOWLEDGE_BASE_PATH = path.resolve(__dirname, '../DR_MILLER_KNOWLEDGE_BASE.md');
let KNOWLEDGE_BASE = '';
try {
  KNOWLEDGE_BASE = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf-8');
  console.log(`✅ Loaded knowledge base (${Math.round(KNOWLEDGE_BASE.length / 1000)}K chars)`);
} catch (e) {
  console.warn('⚠️ Knowledge base not found, using basic prompt only');
}

// System prompt with knowledge base
const SYSTEM_PROMPT = `You are Dr. Richard Louis Miller. You have access to your complete knowledge base below. Use it to respond with your ACTUAL words, stories, and specific advice—not generic responses.

THIS IS A MULTI-TURN CONVERSATION. Take 2-3 exchanges to understand the person before recommending an exercise.

CONVERSATION STYLE:
- Simple, direct language. No therapy jargon. No poetic phrases.
- Short sentences. You ask questions. You listen.
- Warm but no-nonsense. You don't sugarcoat.
- Share your own struggles when relevant (Winnebago accident, wife's cancer, etc.)
- Use your signature phrases naturally.

RESPONSE FORMAT - respond with ONLY valid JSON:
{"message": "Your response here", "action": null}

When recommending an exercise:
{"message": "Brief lead-in using your actual words", "action": {"type": "START_EXERCISE", "id": "breathing"}}

ACTIONS:
- START_EXERCISE: breathing | golden_light | counting | relaxation | self_talk
- CAPTURE_INTENTION: {"type": "CAPTURE_INTENTION", "text": "the intention"}
- SHOW_PROGRESS: {"type": "SHOW_PROGRESS"}
- null: Continue conversation

---

YOUR KNOWLEDGE BASE (use this to respond authentically):

${KNOWLEDGE_BASE}`;

// Store conversation history per session
const conversations: Map<string, Array<{ role: string; parts: Array<{ text: string }> }>> = new Map();

// HTML page with audio support
const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dr. Miller Voice Coach</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0A0E1A;
      color: #F0F0F0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #1A1F2E;
    }

    .header h1 {
      color: #D4A853;
      font-size: 24px;
      font-weight: 300;
      margin-bottom: 8px;
    }

    .header p {
      color: #8A8A8A;
      font-size: 14px;
    }

    .tts-status {
      margin-top: 8px;
      padding: 4px 12px;
      background: #1A1F2E;
      border-radius: 12px;
      display: inline-block;
      font-size: 12px;
    }

    .tts-status.enabled { color: #10B981; }
    .tts-status.disabled { color: #EF4444; }

    .chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    .message {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    .message.user { align-items: flex-end; }
    .message.coach { align-items: flex-start; }

    .message-bubble {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 15px;
      line-height: 1.4;
    }

    .user .message-bubble {
      background: #D4A853;
      color: #0A0E1A;
      border-bottom-right-radius: 4px;
    }

    .coach .message-bubble {
      background: #1A1F2E;
      color: #F0F0F0;
      border-bottom-left-radius: 4px;
    }

    .action-badge {
      margin-top: 8px;
      padding: 6px 12px;
      background: rgba(212, 168, 83, 0.2);
      border: 1px solid #D4A853;
      border-radius: 20px;
      font-size: 12px;
      color: #D4A853;
    }

    .latency-info {
      margin-top: 4px;
      font-size: 11px;
      color: #5A5A5A;
      display: flex;
      gap: 12px;
    }

    .audio-indicator {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #D4A853;
    }

    .audio-indicator.playing::before {
      content: '🔊';
    }

    .input-container {
      padding: 16px 20px;
      background: #0D1117;
      border-top: 1px solid #1A1F2E;
    }

    .input-wrapper {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      gap: 12px;
    }

    #message-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #1A1F2E;
      border-radius: 25px;
      background: #1A1F2E;
      color: #F0F0F0;
      font-size: 15px;
      outline: none;
    }

    #message-input:focus { border-color: #D4A853; }
    #message-input::placeholder { color: #5A5A5A; }

    #send-btn {
      padding: 12px 24px;
      background: #D4A853;
      color: #0A0E1A;
      border: none;
      border-radius: 25px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
    }

    #send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background: #1A1F2E;
      border-radius: 16px;
      width: fit-content;
    }

    .typing span {
      width: 8px;
      height: 8px;
      background: #D4A853;
      border-radius: 50%;
      animation: typing 1s infinite;
    }

    .typing span:nth-child(2) { animation-delay: 0.2s; }
    .typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    .stats {
      padding: 12px 20px;
      background: #0D1117;
      text-align: center;
      font-size: 12px;
      color: #5A5A5A;
    }

    .quick-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      padding: 0 20px;
    }

    .quick-prompt {
      padding: 8px 14px;
      background: #1A1F2E;
      border: 1px solid #2A2F3E;
      border-radius: 20px;
      color: #8A8A8A;
      font-size: 13px;
      cursor: pointer;
    }

    .quick-prompt:hover {
      border-color: #D4A853;
      color: #D4A853;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧘 Dr. Miller Voice Coach</h1>
    <p>Gemini 3 Flash Preview + ElevenLabs TTS</p>
    <div class="tts-status" id="tts-status">TTS: Checking...</div>
  </div>

  <div class="quick-prompts">
    <button class="quick-prompt" onclick="sendQuick('I\\'m feeling really anxious')">I'm anxious</button>
    <button class="quick-prompt" onclick="sendQuick('My mind won\\'t stop racing')">Racing thoughts</button>
    <button class="quick-prompt" onclick="sendQuick('I\\'m so stupid')">Self-criticism</button>
    <button class="quick-prompt" onclick="sendQuick('I need more energy')">Low energy</button>
    <button class="quick-prompt" onclick="sendQuick('How am I doing?')">My progress</button>
  </div>

  <div class="chat-container" id="chat">
    <div class="message coach">
      <div class="message-bubble">Good ${getTimeOfDay()}. What's on your mind?</div>
    </div>
  </div>

  <div class="stats" id="stats">
    Requests: <span id="stat-requests">0</span> |
    Avg LLM: <span id="stat-avg">-</span> |
    Last LLM: <span id="stat-last">-</span> |
    Last TTS: <span id="stat-tts">-</span>
  </div>

  <div class="input-container">
    <div class="input-wrapper">
      <input type="text" id="message-input" placeholder="Type a message..." autocomplete="off">
      <button id="send-btn" onclick="sendMessage()">Send</button>
    </div>
  </div>

  <script>
    const chat = document.getElementById('chat');
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const ttsStatus = document.getElementById('tts-status');

    let stats = { requests: 0, totalLatency: 0 };
    let ttsEnabled = false;

    // Check TTS status on load
    fetch('/tts-status').then(r => r.json()).then(data => {
      ttsEnabled = data.enabled;
      ttsStatus.textContent = ttsEnabled ? 'TTS: Enabled 🔊' : 'TTS: No API Key';
      ttsStatus.className = 'tts-status ' + (ttsEnabled ? 'enabled' : 'disabled');
    });

    function updateStats(llmLatency, ttsLatency = null) {
      stats.requests++;
      stats.totalLatency += llmLatency;

      document.getElementById('stat-requests').textContent = stats.requests;
      document.getElementById('stat-avg').textContent = Math.round(stats.totalLatency / stats.requests) + 'ms';
      document.getElementById('stat-last').textContent = llmLatency + 'ms';
      if (ttsLatency !== null) {
        document.getElementById('stat-tts').textContent = ttsLatency + 'ms';
      }
    }

    function addMessage(text, isUser, action = null, llmLatency = null, ttsLatency = null, audioUrl = null) {
      const div = document.createElement('div');
      div.className = 'message ' + (isUser ? 'user' : 'coach');

      let html = '<div class="message-bubble">' + escapeHtml(text) + '</div>';

      if (action) {
        html += '<div class="action-badge">⚡ ' + escapeHtml(action.type) + (action.id ? ': ' + action.id : '') + '</div>';
      }

      if (llmLatency !== null) {
        html += '<div class="latency-info">';
        html += '<span>LLM: ' + llmLatency + 'ms</span>';
        if (ttsLatency !== null) {
          html += '<span>TTS: ' + ttsLatency + 'ms</span>';
        }
        if (audioUrl) {
          html += '<span class="audio-indicator playing">Audio</span>';
        }
        html += '</div>';
      }

      div.innerHTML = html;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;

      // Play audio if available
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch(e => console.log('Audio autoplay blocked:', e));
      }
    }

    function addTyping() {
      const div = document.createElement('div');
      div.className = 'message coach';
      div.id = 'typing';
      div.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    function removeTyping() {
      const typing = document.getElementById('typing');
      if (typing) typing.remove();
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function sendQuick(text) {
      input.value = text;
      sendMessage();
    }

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      sendBtn.disabled = true;

      addMessage(text, true);
      addTyping();

      try {
        const response = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        removeTyping();

        if (data.error) {
          addMessage('Error: ' + data.error, false);
        } else {
          addMessage(
            data.message,
            false,
            data.action,
            data.llmLatency,
            data.ttsLatency,
            data.audioUrl
          );
          updateStats(data.llmLatency, data.ttsLatency);
        }
      } catch (err) {
        removeTyping();
        addMessage('Connection error: ' + err.message, false);
      }

      sendBtn.disabled = false;
      input.focus();
    }

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    input.focus();
  </script>
</body>
</html>`.replace('${getTimeOfDay()}', getTimeOfDay());

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

// Call Gemini 3 Flash Preview
async function callGemini(
  message: string,
  history: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<{ message: string; action: any; latency: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const startTime = Date.now();

  const contextInfo = `Time of day: ${getTimeOfDay()}
User's current streak: 12 days
Today's progress: breathing 2/5, golden_light 0/1`;

  // Gemini 3 Flash Preview
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      systemInstruction: {
        parts: [{ text: `${SYSTEM_PROMPT}\n\nUSER CONTEXT:\n${contextInfo}` }],
      },
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 1024,
        thinkingConfig: {
          thinkingLevel: 'low',
        },
      },
    }),
  });

  const latency = Date.now() - startTime;

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  console.log('Raw LLM response:', responseText);

  // Parse JSON response with improved handling
  let parsed = { message: responseText, action: null as any };
  try {
    // Try to find JSON object in response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const json = JSON.parse(jsonMatch[0]);
      // Extract message, cleaning up any artifacts
      let cleanMessage = json.message || responseText;
      // Remove any "message:" prefix if the model accidentally included it
      cleanMessage = cleanMessage.replace(/^message:\s*/i, '').trim();
      // Remove surrounding quotes if present
      cleanMessage = cleanMessage.replace(/^["']|["']$/g, '').trim();
      parsed = { message: cleanMessage, action: json.action || null };
    } else {
      // No JSON found - clean up the raw text
      let cleanMessage = responseText.trim();
      // Remove common formatting artifacts
      cleanMessage = cleanMessage.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
      cleanMessage = cleanMessage.replace(/^message:\s*/i, '').trim();
      cleanMessage = cleanMessage.replace(/^["']|["']$/g, '').trim();
      parsed = { message: cleanMessage, action: null };
    }
  } catch (e) {
    console.log('JSON parse error, extracting message from malformed JSON:', e);
    // Try to extract message from truncated/malformed JSON
    let cleanMessage = responseText.trim();

    // Remove JSON wrapper artifacts from truncated responses
    // Handles: {"message": "actual text here...
    const messageMatch = cleanMessage.match(/\{\s*"message"\s*:\s*"([^"]*)/);
    if (messageMatch) {
      cleanMessage = messageMatch[1];
    } else {
      // Fallback: remove common formatting artifacts
      cleanMessage = cleanMessage.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
      cleanMessage = cleanMessage.replace(/^\{\s*"message"\s*:\s*"?/i, '');
      cleanMessage = cleanMessage.replace(/^message:\s*/i, '').trim();
    }

    cleanMessage = cleanMessage.replace(/["']$/g, '').trim();
    parsed = { message: cleanMessage, action: null };
  }

  console.log('Parsed message:', parsed.message);

  return { ...parsed, latency };
}

// Call ElevenLabs TTS
async function callElevenLabsTTS(text: string): Promise<{ audioBase64: string; latency: number } | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    console.log('ElevenLabs TTS not configured (missing API key or voice ID)');
    return null;
  }

  const startTime = Date.now();

  try {
    // ElevenLabs TTS endpoint - using Flash v2.5 for low latency
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_flash_v2_5',  // Low latency model (~75ms)
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    const latency = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS error:', response.status, errorText);
      return null;
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return { audioBase64, latency };
  } catch (error) {
    console.error('ElevenLabs TTS failed:', error);
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve HTML page
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML_PAGE);
    return;
  }

  // TTS status check
  if (req.method === 'GET' && req.url === '/tts-status') {
    const enabled = !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ enabled }));
    return;
  }

  // Chat endpoint
  if (req.method === 'POST' && req.url === '/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { message, sessionId = 'default' } = JSON.parse(body);

        // Get or create conversation history
        if (!conversations.has(sessionId)) {
          conversations.set(sessionId, []);
        }
        const history = conversations.get(sessionId)!;

        // Call Gemini
        const llmResult = await callGemini(message, history);

        // Update history
        history.push({ role: 'user', parts: [{ text: message }] });
        history.push({ role: 'model', parts: [{ text: llmResult.message }] });

        // Keep history manageable
        if (history.length > 20) {
          history.splice(0, history.length - 20);
        }

        // Try to generate TTS
        const ttsResult = await callElevenLabsTTS(llmResult.message);

        const response: any = {
          message: llmResult.message,
          action: llmResult.action,
          llmLatency: llmResult.latency,
        };

        if (ttsResult) {
          response.ttsLatency = ttsResult.latency;
          response.audioUrl = `data:audio/mpeg;base64,${ttsResult.audioBase64}`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  const ttsConfigured = !!(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🧘  DR. MILLER VOICE COACH                             ║
║                                                            ║
║     Model: Gemini 3 Flash Preview (thinking: low)          ║
║     TTS:   ${ttsConfigured ? 'ElevenLabs Flash v2.5 ✅' : 'Not configured (add ELEVENLABS_API_KEY)'}
║                                                            ║
║     Open: http://localhost:${PORT}                            ║
║     Press Ctrl+C to stop                                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
});
