import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, SkipForward, Home, BedDouble, CookingPot, Bath, UtensilsCrossed, Sparkles } from 'lucide-react';
import { birds } from '../../data/birds';
import { DESIGN_STYLES, MOODS } from '../../data/constants';
import { COLOR_FAMILIES, getQuizResults } from '../../utils/quizScoring';
import PaletteStrip from '../shared/PaletteStrip';
import SaveButton from '../shared/SaveButton';
import { useNav } from '../../App';
import { useStudioContext } from '../../hooks/useStudio';

const ROOM_OPTIONS = [
  { id: 'bedroom', label: 'Bedroom', Icon: BedDouble },
  { id: 'living-room', label: 'Living Room', Icon: Home },
  { id: 'kitchen', label: 'Kitchen', Icon: CookingPot },
  { id: 'bathroom', label: 'Bathroom', Icon: Bath },
  { id: 'dining-room', label: 'Dining Room', Icon: UtensilsCrossed },
];

export default function QuizFlow({ onClose }) {
  const { navigate } = useNav();
  const { saveQuizResult } = useStudioContext();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ room: null, mood: null, styles: [], existingColors: [] });
  const [results, setResults] = useState(null);

  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const toggleStyle = (styleId) => {
    setAnswers(prev => {
      const current = prev.styles;
      if (current.includes(styleId)) return { ...prev, styles: current.filter(s => s !== styleId) };
      if (current.length >= 3) return prev;
      return { ...prev, styles: [...current, styleId] };
    });
  };

  const toggleColor = (colorId) => {
    setAnswers(prev => {
      const current = prev.existingColors;
      if (current.includes(colorId)) return { ...prev, existingColors: current.filter(c => c !== colorId) };
      return { ...prev, existingColors: [...current, colorId] };
    });
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate results
      const quizResults = getQuizResults(birds, answers, 5);
      setResults(quizResults);
      saveQuizResult({ answers, results: quizResults.map(r => ({ birdId: r.bird.id, score: r.score })) });
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const canAdvance = () => {
    if (step === 0) return !!answers.room;
    if (step === 1) return !!answers.mood;
    if (step === 2) return answers.styles.length > 0;
    return true; // Step 3 is optional
  };

  // Results screen
  if (results) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-gray-800">Your Top Matches</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="space-y-4">
            {results.map(({ bird, score, reason }, idx) => (
              <div
                key={bird.id}
                className="bg-white rounded-2xl border border-plumage-border overflow-hidden hover:shadow-md transition-all"
              >
                <PaletteStrip colors={bird.colors} height="h-10" clickable={false} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {idx === 0 && (
                          <span className="px-2 py-0.5 bg-plumage-accent text-white text-[10px] font-bold rounded-full uppercase">Best Match</span>
                        )}
                        <span className="text-[10px] text-gray-400">#{idx + 1}</span>
                      </div>
                      <h3 className="font-display text-lg text-gray-800">{bird.name}</h3>
                      <p className="text-xs text-gray-400 italic">{bird.scientific}</p>
                    </div>
                    <SaveButton birdId={bird.id} />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{reason}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onClose(); navigate('palette-detail', { birdId: bird.id }); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-plumage-primary text-white rounded-lg text-xs font-medium hover:bg-plumage-primary-light transition-colors"
                    >
                      See Palette <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => { onClose(); navigate('chat', { context: { type: 'quiz-result', bird, answers } }); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-plumage-surface-alt text-plumage-primary rounded-lg text-xs font-medium hover:bg-emerald-50 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" /> Ask AI
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => { setResults(null); setStep(0); setAnswers({ room: null, mood: null, styles: [], existingColors: [] }); }}
              className="text-sm text-plumage-primary font-medium hover:underline"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-plumage-border bg-white/80 backdrop-blur-sm">
        <button onClick={step > 0 ? prevStep : onClose} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> {step > 0 ? 'Back' : 'Close'}
        </button>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= step ? 'bg-plumage-primary' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-xs text-gray-400">{step + 1}/4</span>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-lg mx-auto quiz-slide-in" key={step}>
          {/* Step 0: Room */}
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl text-gray-800 mb-2 text-center">What room are you working on?</h2>
              <p className="text-sm text-gray-500 text-center mb-6">We'll prioritize palettes that shine in your space.</p>
              <div className="grid grid-cols-1 gap-3">
                {ROOM_OPTIONS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setAnswer('room', id); setStep(1); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      answers.room === id
                        ? 'border-plumage-primary bg-emerald-50'
                        : 'border-plumage-border bg-white hover:border-plumage-primary/40'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${answers.room === id ? 'text-plumage-primary' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-800">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Mood */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl text-gray-800 mb-2 text-center">What mood do you want?</h2>
              <p className="text-sm text-gray-500 text-center mb-6">How should your room feel?</p>
              <div className="grid grid-cols-1 gap-3">
                {MOODS.map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => { setAnswer('mood', mood.id); setStep(2); }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      answers.mood === mood.id
                        ? 'border-plumage-primary bg-emerald-50'
                        : 'border-transparent hover:border-plumage-primary/40'
                    }`}
                  >
                    <div className={`bg-gradient-to-r ${mood.gradient} rounded-lg p-3 mb-1`}>
                      <p className="text-sm font-semibold text-gray-800">{mood.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Styles */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl text-gray-800 mb-2 text-center">Pick your style</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Select up to 3 that resonate with you.</p>
              <div className="grid grid-cols-2 gap-3">
                {DESIGN_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      answers.styles.includes(style.id)
                        ? 'border-plumage-primary bg-emerald-50'
                        : 'border-plumage-border bg-white hover:border-plumage-primary/40'
                    } ${answers.styles.length >= 3 && !answers.styles.includes(style.id) ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={answers.styles.length >= 3 && !answers.styles.includes(style.id)}
                  >
                    <p className="text-sm font-medium text-gray-800">{style.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Existing Colors */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl text-gray-800 mb-2 text-center">Any colors already in the room?</h2>
              <p className="text-sm text-gray-500 text-center mb-6">Optional — helps us match your existing pieces.</p>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_FAMILIES.map(family => (
                  <button
                    key={family.id}
                    onClick={() => toggleColor(family.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      answers.existingColors.includes(family.id)
                        ? 'border-plumage-primary bg-emerald-50'
                        : 'border-plumage-border bg-white hover:border-plumage-primary/40'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0" style={{ backgroundColor: family.hex }} />
                    <span className="text-xs font-medium text-gray-700">{family.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-plumage-border bg-white/80 backdrop-blur-sm flex items-center justify-between">
        {step === 3 ? (
          <>
            <button onClick={() => nextStep()} className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
              <SkipForward className="w-4 h-4" /> Skip
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-plumage-primary text-white rounded-xl text-sm font-medium hover:bg-plumage-primary-light transition-colors"
            >
              See My Results <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div />
            {canAdvance() && step !== 0 && step !== 1 && (
              <button
                onClick={nextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-plumage-primary text-white rounded-xl text-sm font-medium hover:bg-plumage-primary-light transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
