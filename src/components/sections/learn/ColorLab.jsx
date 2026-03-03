import React, { useState, useMemo } from 'react';
import { RotateCcw, Check, X, ArrowRight, Target, Zap } from 'lucide-react';
import { birds } from '../../../data/birds';
import { getUndertone, getTextColor } from '../../../utils/colorUtils';
import { ROLE_LABELS } from '../../../data/constants';

// ─── Helpers ──────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandomBird() {
  return birds[Math.floor(Math.random() * birds.length)];
}

function generateQuizColors() {
  const pool = [];
  birds.forEach(bird => {
    bird.colors.forEach(c => {
      pool.push({ hex: c.hex, name: c.name, birdName: bird.name });
    });
  });
  return shuffle(pool).slice(0, 10);
}

// ─── Room Color Assignment Game ───────────────────────────

const STEPS = [
  { role: 'dominant', label: 'Step 1 of 3', question: 'Which color should cover 60% of the walls?', tip: 'Think: what sets the room\'s overall mood?' },
  { role: 'secondary', label: 'Step 2 of 3', question: 'Which color goes on furniture & textiles (30%)?', tip: 'Think: what supports the walls without competing?' },
  { role: 'accent', label: 'Step 3 of 3', question: 'Which would you use as the 10% accent?', tip: 'Think: what draws the eye in small doses?' },
];

function RoomColorGame() {
  const [bird, setBird] = useState(pickRandomBird);
  const [colors, setColors] = useState(() => shuffle(bird.colors));
  const [stepIdx, setStepIdx] = useState(0);
  const [choices, setChoices] = useState({});
  const [usedHexes, setUsedHexes] = useState([]);

  const phase = stepIdx >= STEPS.length ? 'results' : 'playing';

  const pickColor = (hex) => {
    if (phase === 'results') return;
    const role = STEPS[stepIdx].role;
    setChoices(prev => ({ ...prev, [role]: hex }));
    setUsedHexes(prev => [...prev, hex]);
    setStepIdx(prev => prev + 1);
  };

  const actualDominant = bird.colors.find(c => c.role === 'dominant')?.hex;
  const actualSecondary = bird.colors.find(c => c.role === 'secondary')?.hex;
  const actualAccents = bird.colors.filter(c => c.role === 'accent').map(c => c.hex);

  const results = phase === 'results' ? [
    { role: 'dominant', correct: choices.dominant === actualDominant, chosen: choices.dominant, actual: actualDominant },
    { role: 'secondary', correct: choices.secondary === actualSecondary, chosen: choices.secondary, actual: actualSecondary },
    { role: 'accent', correct: actualAccents.includes(choices.accent), chosen: choices.accent, actual: actualAccents[0] },
  ] : [];
  const score = results.filter(r => r.correct).length;

  const reset = () => {
    const newBird = pickRandomBird();
    setBird(newBird);
    setColors(shuffle(newBird.colors));
    setStepIdx(0);
    setChoices({});
    setUsedHexes([]);
  };

  if (phase === 'results') {
    return (
      <div className="space-y-4">
        <div className="text-center mb-2">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            score === 3 ? 'bg-emerald-100 text-emerald-700' : score >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {score === 3 ? 'Perfect!' : score >= 2 ? 'Almost!' : 'Learning moment!'}
            {' '}{score}/3 correct
          </div>
          <p className="text-sm text-gray-500 mt-2">Palette: <strong>{bird.name}</strong></p>
        </div>

        {results.map(r => {
          const roleInfo = ROLE_LABELS[r.role];
          return (
            <div key={r.role} className="bg-plumage-surface-alt rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                {r.correct
                  ? <Check className="w-4 h-4 text-emerald-500" />
                  : <X className="w-4 h-4 text-rose-400" />}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleInfo?.bg} ${roleInfo?.text}`}>
                  {roleInfo?.label}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400">You:</span>
                  <div className="w-8 h-8 rounded-lg border" style={{ backgroundColor: r.chosen }} />
                </div>
                {!r.correct && (
                  <>
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400">Actual:</span>
                      <div className="w-8 h-8 rounded-lg border" style={{ backgroundColor: r.actual }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <div className="bg-white rounded-xl p-4 border border-plumage-border">
          <p className="text-xs text-gray-600">
            <strong>Why this works:</strong> {bird.name}'s {bird.harmony?.type} palette uses{' '}
            its most grounding tone as the dominant because it sets a {bird.moods?.[0] || 'balanced'} mood
            across large surfaces. The secondary adds depth without competing, while the accent color
            introduces energy in small, intentional doses.
          </p>
        </div>

        <button onClick={reset} className="w-full flex items-center justify-center gap-2 bg-plumage-primary text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-plumage-primary/90 transition-colors">
          <RotateCcw className="w-4 h-4" /> Try another palette
        </button>
      </div>
    );
  }

  const step = STEPS[stepIdx];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s.role} className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < stepIdx ? 'bg-plumage-primary/30' : i === stepIdx ? 'bg-plumage-primary' : 'bg-gray-200'
          }`} />
        ))}
      </div>

      {/* Prompt */}
      <div className="text-center">
        <p className="text-[10px] text-plumage-primary font-bold uppercase tracking-wider">{step.label}</p>
        <p className="font-display text-base text-gray-800 mt-1">{step.question}</p>
        <p className="text-xs text-gray-400 mt-0.5">{step.tip}</p>
      </div>

      {/* Color swatches */}
      <div className="grid grid-cols-3 gap-3">
        {colors.map(color => {
          const isUsed = usedHexes.includes(color.hex);
          return (
            <button
              key={color.hex}
              onClick={() => !isUsed && pickColor(color.hex)}
              disabled={isUsed}
              className={`aspect-square rounded-xl border-2 transition-all ${
                isUsed
                  ? 'opacity-20 cursor-not-allowed border-gray-200'
                  : 'border-transparent hover:border-plumage-primary hover:scale-105 cursor-pointer shadow-sm'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>

      {/* Already assigned chips */}
      {usedHexes.length > 0 && (
        <div className="flex gap-3 justify-center">
          {Object.entries(choices).map(([role, hex]) => (
            <div key={role} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: hex }} />
              <span className="text-[10px] text-gray-400">{ROLE_LABELS[role]?.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Undertone Trainer ────────────────────────────────────

const UNDERTONE_TIPS = {
  warm: 'This color leans yellow/red — it advances toward you, creating energy and coziness.',
  cool: 'This color leans blue/green — it recedes away, creating calm and spaciousness.',
  neutral: 'This color has balanced undertones — it bridges warm and cool palettes effortlessly.',
};

function UndertoneTrainer() {
  const [colors, setColors] = useState(generateQuizColors);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const done = idx >= colors.length;
  const score = answers.filter(a => a.correct).length;
  const current = colors[idx];

  const guess = (tone) => {
    const actual = getUndertone(current.hex);
    const entry = { color: current, guess: tone, actual, correct: tone === actual };
    setAnswers(prev => [...prev, entry]);
    setFeedback(entry);
  };

  const next = () => {
    setFeedback(null);
    setIdx(prev => prev + 1);
  };

  const reset = () => {
    setColors(generateQuizColors());
    setIdx(0);
    setAnswers([]);
    setFeedback(null);
  };

  if (done) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            score >= 8 ? 'bg-emerald-100 text-emerald-700' : score >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {score >= 8 ? 'Color Expert!' : score >= 5 ? 'Good Eye!' : 'Keep Practicing!'}
            {' '}{score}/10
          </div>
        </div>

        <div className="space-y-1.5">
          {answers.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-plumage-surface-alt rounded-lg p-2">
              <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ backgroundColor: a.color.hex }} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 truncate">{a.color.birdName}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {a.correct
                  ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                  : <X className="w-3.5 h-3.5 text-rose-400" />}
                <span className="text-[10px] text-gray-500">{a.actual}</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={reset} className="w-full flex items-center justify-center gap-2 bg-plumage-primary text-white rounded-xl px-4 py-3 text-sm font-medium">
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-400">{idx + 1} / 10</span>
        <span className="text-[10px] text-gray-400">{score} correct</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${
            i < idx ? (answers[i]?.correct ? 'bg-emerald-400' : 'bg-rose-300') :
            i === idx ? 'bg-plumage-primary' : 'bg-gray-200'
          }`} />
        ))}
      </div>

      {/* Big swatch */}
      <div className="flex justify-center py-2">
        <div
          className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white"
          style={{ backgroundColor: current.hex }}
        />
      </div>

      {feedback ? (
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            feedback.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {feedback.correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {feedback.correct ? 'Correct!' : `It's ${feedback.actual}`}
          </div>
          <p className="text-xs text-gray-500">{UNDERTONE_TIPS[feedback.actual]}</p>
          <button onClick={next} className="bg-plumage-primary text-white rounded-xl px-6 py-2 text-sm font-medium">
            Next
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-center font-display text-sm text-gray-800">What's the undertone?</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'warm', label: 'Warm', style: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200' },
              { id: 'cool', label: 'Cool', style: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200' },
              { id: 'neutral', label: 'Neutral', style: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => guess(opt.id)}
                className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${opt.style}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ColorLab Tab ────────────────────────────────────

export default function ColorLab() {
  const [mode, setMode] = useState('room-game');

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('room-game')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            mode === 'room-game'
              ? 'bg-plumage-primary/10 text-plumage-primary border border-plumage-primary/30'
              : 'bg-white text-gray-500 border border-plumage-border'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Room Assignment
        </button>
        <button
          onClick={() => setMode('undertone')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            mode === 'undertone'
              ? 'bg-plumage-primary/10 text-plumage-primary border border-plumage-primary/30'
              : 'bg-white text-gray-500 border border-plumage-border'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Undertone Trainer
        </button>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-plumage-border">
        {mode === 'room-game' ? (
          <>
            <h3 className="font-display text-lg text-gray-800 mb-1">Room Color Assignment</h3>
            <p className="text-sm text-gray-600 mb-5">
              Can you assign the right colors to the right roles? Test your design instincts with real bird palettes.
            </p>
            <RoomColorGame />
          </>
        ) : (
          <>
            <h3 className="font-display text-lg text-gray-800 mb-1">Undertone Trainer</h3>
            <p className="text-sm text-gray-600 mb-5">
              Train your eye to spot warm, cool, and neutral undertones. 10 colors, instant feedback.
            </p>
            <UndertoneTrainer />
          </>
        )}
      </div>
    </div>
  );
}
