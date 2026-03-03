import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Settings, Sparkles, Palette, Loader2 } from 'lucide-react';
import { birds } from '../../data/birds';
import { FLOCK_PAIRINGS } from '../../data/flockPairings';
import { useStudioContext } from '../../hooks/useStudio';

function buildSystemPrompt() {
  const paletteData = birds.map(b =>
    `${b.name} (${b.scientific}): ${b.colors.map(c => `${c.name} ${c.hex} [${c.role}]`).join(', ')}. Harmony: ${b.harmony.type}. Styles: ${b.styles.join(', ')}. Season: ${b.season}. Rooms: ${b.rooms.filter(r => r.rating >= 4).map(r => r.room).join(', ') || 'versatile'}.`
  ).join('\n');

  const pairingData = FLOCK_PAIRINGS.map(p => {
    const b1 = birds.find(b => b.id === p.birdIds[0]);
    const b2 = birds.find(b => b.id === p.birdIds[1]);
    return `${p.name}: ${b1?.name} + ${b2?.name} — ${p.moodBoard.vibe}. Best in: ${p.moodBoard.rooms.join(', ')}.`;
  }).join('\n');

  return `You are the Ploom AI Color Consultant — an expert interior designer who helps people use bird-inspired color palettes in their homes.

CORE KNOWLEDGE — COLOR THEORY:
- 60-30-10 Rule: 60% dominant (walls), 30% secondary (textiles/furniture), 10% accent (decor/art). This ratio creates visual balance.
- Color Harmonies: Analogous (adjacent hues, serene), Complementary (opposite hues, energetic), Triadic (3 evenly spaced, rich), Split-Complementary (base + 2 adjacent to complement), Monochromatic (one hue, layered values).
- Undertones: Warm (yellow/red base) advance and energize. Cool (blue/green base) recede and calm. Neutral (balanced) bridge both.
- Value & Saturation: Muted/desaturated colors feel sophisticated and livable. High saturation overwhelms in large doses. Dark values create intimacy; light values create openness.
- Lighting Effects: North-facing rooms make colors cooler/grayer. South-facing rooms warm everything. Incandescent light adds warmth. Cool LED shifts colors blue. Always test paint samples at morning, noon, and evening.

CORE KNOWLEDGE — INTERIOR DESIGN:
- Paint Finishes: Matte (walls, hides imperfections), Eggshell (living areas, slight sheen), Satin (kitchens/baths, wipeable), Semi-Gloss (trim/doors, durable), High-Gloss (accents, dramatic).
- Room Psychology: Bedrooms want calming (blues, greens, soft neutrals). Dining rooms want warmth and appetite stimulation (reds, greens, golds). Kitchens want energy (warm whites, blues, greens). Bathrooms want spa-like (blues, greens, warm whites). Living rooms are versatile.
- Small rooms: lighter colors, fewer contrasts. Large rooms: can handle dark/bold colors. Low ceilings: paint ceiling lighter than walls. Long narrow rooms: warm color on short walls to draw them in.

AVAILABLE PALETTES:
${paletteData}

CURATED PAIRINGS (Flock Pairings):
${pairingData}

GUIDELINES:
- Always recommend specific Ploom palette colors by name and hex code.
- Explain WHY a palette works for the user's situation using color theory.
- If mixing palettes, explain which colors from each bird work together and why.
- Give practical advice: which walls, which textiles, which accents.
- Consider the user's lighting, room size, existing furniture, and style preferences.
- Be warm, encouraging, and specific. Avoid vague advice.
- Keep responses concise but helpful — aim for 2-4 short paragraphs.
- When suggesting colors, format hex codes so users can reference them.`;
}

function getContextualPrompts(context) {
  if (!context) return [
    'Which palette works for a cozy north-facing bedroom?',
    'I have a gray couch — which bird palette matches?',
    'What colors make a small kitchen feel bigger?',
  ];

  if (context.type === 'palette') {
    const bird = context.bird;
    return [
      `How would I use the ${bird.name} palette in a small bedroom?`,
      `What pairs well with ${bird.colors[0]?.name || 'the dominant color'}?`,
      `Which rooms work best for the ${bird.name} palette?`,
    ];
  }

  if (context.type === 'quiz-result') {
    return [
      `Why is ${context.bird.name} a good match for my space?`,
      'What if I want something bolder?',
      'How do I combine this with my existing furniture?',
    ];
  }

  if (context.type === 'project') {
    return [
      `Any tips for using this palette in my ${context.roomType || 'room'}?`,
      'What accent pieces would complement this palette?',
      'How should I handle the lighting in this room?',
    ];
  }

  return [
    'Which palette works for a cozy north-facing bedroom?',
    'I have a gray couch — which bird palette matches?',
    'What colors make a small kitchen feel bigger?',
  ];
}

function buildContextPrefix(context) {
  if (!context) return '';
  if (context.type === 'palette') {
    const bird = context.bird;
    return `[User is currently viewing the "${bird.name}" palette: ${bird.colors.map(c => `${c.name} ${c.hex}`).join(', ')}. Harmony: ${bird.harmony.type}. Styles: ${bird.styles.join(', ')}.]

`;
  }
  if (context.type === 'quiz-result') {
    const bird = context.bird;
    const a = context.answers;
    return `[User just completed the palette quiz. Room: ${a.room}. Mood: ${a.mood}. Styles: ${a.styles?.join(', ')}. Their top match is "${bird.name}": ${bird.colors.map(c => `${c.name} ${c.hex}`).join(', ')}.]

`;
  }
  return '';
}

export default function AIChatPanel({ context, onClose }) {
  const { studio, setApiKey } = useStudioContext();
  const apiKey = studio.aiApiKey;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyDraft, setKeyDraft] = useState(apiKey);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const prompts = getContextualPrompts(context);

  const saveKey = () => {
    setApiKey(keyDraft);
    setShowKeyInput(false);
  };

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    if (!apiKey) { setShowKeyInput(true); return; }

    const prefixedContent = messages.length === 0 ? buildContextPrefix(context) + content : content;
    const userMsg = { role: 'user', content: prefixedContent };
    const updatedMessages = [...messages, { role: 'user', content }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: prefixedContent }];
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: buildSystemPrompt(),
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}. Check your API key and try again.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-plumage-border">
      {/* Header */}
      <div className="bg-gradient-to-r from-plumage-primary to-plumage-primary-light text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold text-sm">Color Consultant</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowKeyInput(!showKeyInput)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" title="API Key Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* API Key Input */}
      {showKeyInput && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 flex-shrink-0">
          <p className="text-xs text-amber-800 mb-2 font-medium">Enter your Claude API key (stored in your browser only):</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 text-sm px-3 py-1.5 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-plumage-primary/40"
            />
            <button onClick={saveKey} className="px-3 py-1.5 bg-plumage-primary text-white text-sm rounded-lg hover:bg-plumage-primary-light">Save</button>
          </div>
          <p className="text-[10px] text-amber-600 mt-1">Get a key at console.anthropic.com. Never shared with anyone.</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Palette className="w-10 h-10 text-plumage-primary/30 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-4">Ask me anything about color palettes, room styling, or which birds work best for your space.</p>
            <div className="space-y-2">
              {prompts.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left text-xs px-3 py-2 bg-plumage-surface-alt hover:bg-emerald-50 rounded-lg text-gray-600 hover:text-plumage-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-plumage-primary text-white rounded-br-sm'
                : 'bg-plumage-surface-alt text-gray-800 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-plumage-surface-alt text-gray-500 px-3 py-2 rounded-xl rounded-bl-sm text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-plumage-border flex-shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={apiKey ? 'Ask about colors, palettes, rooms...' : 'Set your API key first (gear icon)'}
            disabled={loading}
            className="flex-1 text-sm px-3 py-2 border border-plumage-border rounded-xl focus:outline-none focus:ring-2 focus:ring-plumage-primary/30 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="p-2 bg-plumage-primary text-white rounded-xl hover:bg-plumage-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
