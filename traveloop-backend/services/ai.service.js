/**
 * ai.service.js — Traveloop AI Service
 * Primary: DeepSeek (deepseek-chat)
 * Fallback: Groq (llama-3.3-70b-versatile)
 * 
 * NO OpenAI. NO fake fallbacks. Real AI only.
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const AI_TIMEOUT_MS = 45000; // 45 second timeout

// ─── Timeout-safe fetch ────────────────────────────────────────────────────

async function fetchWithTimeout(url, options, timeoutMs = AI_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('AI request timed out after 45 seconds');
    throw err;
  }
}

// ─── DeepSeek ──────────────────────────────────────────────────────────────

async function callDeepSeek(messages, jsonMode = false) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error('DEEPSEEK_API_KEY not set');

  const body = {
    model: 'deepseek-chat',
    messages,
    temperature: 0.7,
    max_tokens: 4096,
  };
  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetchWithTimeout(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('DeepSeek returned empty response');
  return content;
}

// ─── Groq ──────────────────────────────────────────────────────────────────

async function callGroq(messages, jsonMode = false) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY not set');

  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];

  let lastErr;
  for (const model of models) {
    try {
      const body = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      };
      if (jsonMode) {
        body.response_format = { type: 'json_object' };
      }

      const res = await fetchWithTimeout(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        // Rate limited — try next model
        if (res.status === 429) { lastErr = new Error(`Groq rate limited on ${model}`); continue; }
        throw new Error(`Groq API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error(`Groq model ${model} returned empty response`);
      console.log(`[Groq] Success with model: ${model}`);
      return content;
    } catch (err) {
      lastErr = err;
      console.warn(`[Groq] Model ${model} failed: ${err.message}`);
      if (err.message.includes('timed out')) continue;
    }
  }
  throw lastErr || new Error('All Groq models failed');
}

// ─── Core AI Caller — DeepSeek → Groq ─────────────────────────────────────

async function callAI(systemPrompt, userPrompt, jsonMode = false) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  // 1. Try DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      console.log('[AI] Trying DeepSeek...');
      const result = await callDeepSeek(messages, jsonMode);
      console.log('[AI] DeepSeek succeeded');
      return result;
    } catch (err) {
      console.warn(`[AI] DeepSeek failed: ${err.message} — falling back to Groq`);
    }
  }

  // 2. Fallback to Groq
  if (process.env.GROQ_API_KEY) {
    try {
      console.log('[AI] Trying Groq...');
      const result = await callGroq(messages, jsonMode);
      console.log('[AI] Groq succeeded');
      return result;
    } catch (err) {
      console.warn(`[AI] Groq failed: ${err.message}`);
      throw new Error(`All AI providers failed. Last error: ${err.message}`);
    }
  }

  throw new Error('No AI provider configured. Set DEEPSEEK_API_KEY or GROQ_API_KEY in .env');
}

// ─── JSON Extractor ────────────────────────────────────────────────────────

function extractJSON(text) {
  if (!text) throw new Error('AI returned empty text');
  
  let clean = text.trim();
  
  // Strip markdown code fences: ```json ... ``` or ``` ... ```
  const fenceMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) clean = fenceMatch[1].trim();
  
  // Find JSON object or array
  const objMatch = clean.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (objMatch) clean = objMatch[1];

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error('[AI] Failed to parse JSON:', clean.substring(0, 200));
    throw new Error(`AI returned invalid JSON: ${err.message}`);
  }
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Generate free-form text (for chatbot)
 */
async function generateText(userPrompt, systemInstruction = 'You are a helpful travel assistant.') {
  return callAI(systemInstruction, userPrompt, false);
}

/**
 * Generate structured JSON (for all feature endpoints)
 */
async function generateJSON(userPrompt, systemInstruction = 'You are a helpful travel assistant. Always respond with valid JSON only.') {
  // Enforce JSON in system prompt
  const jsonSystemPrompt = systemInstruction.includes('JSON') 
    ? systemInstruction 
    : `${systemInstruction} Always respond with valid JSON only. Do not include markdown code fences or any text outside the JSON.`;
  
  const rawText = await callAI(jsonSystemPrompt, userPrompt, true);
  return extractJSON(rawText);
}

module.exports = { generateText, generateJSON };
