import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Camera, Pipette, Palette, X, Upload, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { extractColors } from '../../utils/colorExtractor';
import { matchPalettesByColors, getMatchExplanation } from '../../utils/paletteHelpers';
import { birds } from '../../data/birds';
import { getTextColor } from '../../utils/colorUtils';
import PaletteStrip from '../shared/PaletteStrip';
import { useNav } from '../../App';

const MODES = [
  { id: 'photo', label: 'Upload Photo', desc: 'Snap your room, a fabric, or anything', Icon: Camera },
  { id: 'hex', label: 'Enter a Color', desc: 'Paste a hex code or pick from the wheel', Icon: Pipette },
  { id: 'rescue', label: 'Rescue My Room', desc: 'Colors not working? We\'ll find the bridge', Icon: Palette },
];

export default function ColorMatchFlow({ onClose }) {
  const { navigate } = useNav();
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState('mode'); // mode | input | extracting | results
  const [extractedColors, setExtractedColors] = useState([]);
  const [inputColors, setInputColors] = useState(['#7A8B6E']);
  const [rescueColors, setRescueColors] = useState(['#B8860B', '#4682B4']);
  const [results, setResults] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef(null);

  const handleSelectMode = (m) => {
    setMode(m);
    setStep('input');
    setExtractedColors([]);
    setResults([]);
    setPhotoPreview(null);
  };

  const handlePhotoUpload = useCallback(async (file) => {
    if (!file) return;
    setStep('extracting');
    setPhotoPreview(URL.createObjectURL(file));
    try {
      const colors = await extractColors(file, 6);
      setExtractedColors(colors);
      const hexes = colors.map(c => c.hex);
      const matches = matchPalettesByColors(hexes, birds, 5, 'match');
      setResults(matches);
      setStep('results');
    } catch {
      setStep('input');
    }
  }, []);

  const handleHexMatch = useCallback(() => {
    const valid = inputColors.filter(c => /^#[0-9A-Fa-f]{6}$/.test(c));
    if (valid.length === 0) return;
    const matches = matchPalettesByColors(valid, birds, 5, 'match');
    setResults(matches);
    setStep('results');
  }, [inputColors]);

  const handleRescueMatch = useCallback(() => {
    const valid = rescueColors.filter(c => /^#[0-9A-Fa-f]{6}$/.test(c));
    if (valid.length < 2) return;
    const matches = matchPalettesByColors(valid, birds, 5, 'rescue');
    setResults(matches);
    setStep('results');
  }, [rescueColors]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) handlePhotoUpload(file);
  }, [handlePhotoUpload]);

  const goToResult = (birdId) => {
    onClose();
    navigate('palette-detail', { birdId });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-plumage-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step !== 'mode' && (
                <button
                  onClick={() => setStep(step === 'results' ? 'input' : 'mode')}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <h2 className="font-display text-lg text-gray-800">Match From Your World</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Step 1: Mode Selection */}
          {step === 'mode' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">How would you like to find your palette?</p>
              {MODES.map(({ id, label, desc, Icon }) => (
                <button
                  key={id}
                  onClick={() => handleSelectMode(id)}
                  className="w-full flex items-center gap-4 p-4 bg-plumage-surface-alt rounded-xl hover:bg-emerald-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                    <Icon className="w-5 h-5 text-plumage-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Photo Upload */}
          {step === 'input' && mode === 'photo' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Upload a photo of your room, a fabric swatch, a tile — anything with colors you love.</p>
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-plumage-border rounded-xl p-10 text-center cursor-pointer hover:border-plumage-primary hover:bg-plumage-surface-alt transition-all"
              >
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handlePhotoUpload(e.target.files?.[0])}
              />
            </div>
          )}

          {/* Step 2: Hex Input */}
          {step === 'input' && mode === 'hex' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Enter a color you already have or love. We'll find bird palettes that match.</p>
              <div className="space-y-3">
                {inputColors.map((hex, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={hex}
                      onChange={e => {
                        const next = [...inputColors];
                        next[i] = e.target.value.toUpperCase();
                        setInputColors(next);
                      }}
                      className="w-12 h-12 rounded-lg border border-plumage-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={hex}
                      onChange={e => {
                        const next = [...inputColors];
                        next[i] = e.target.value.toUpperCase();
                        setInputColors(next);
                      }}
                      placeholder="#7A8B6E"
                      className="flex-1 text-sm px-3 py-2.5 border border-plumage-border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
                    />
                    {inputColors.length > 1 && (
                      <button onClick={() => setInputColors(inputColors.filter((_, j) => j !== i))} className="p-1 text-gray-300 hover:text-gray-500">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {inputColors.length < 3 && (
                  <button
                    onClick={() => setInputColors([...inputColors, '#C8A882'])}
                    className="text-xs text-plumage-primary font-medium hover:underline"
                  >
                    + Add another color
                  </button>
                )}
              </div>
              <button
                onClick={handleHexMatch}
                className="w-full mt-5 py-3 bg-plumage-primary text-white rounded-xl font-medium hover:bg-plumage-primary-light transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Find Matching Palettes
              </button>
            </div>
          )}

          {/* Step 2: Rescue Mode */}
          {step === 'input' && mode === 'rescue' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Enter 2-3 colors in your room that aren't working together. We'll find a bird palette that bridges them.</p>
              <div className="space-y-3">
                {rescueColors.map((hex, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="color"
                      value={hex}
                      onChange={e => {
                        const next = [...rescueColors];
                        next[i] = e.target.value.toUpperCase();
                        setRescueColors(next);
                      }}
                      className="w-12 h-12 rounded-lg border border-plumage-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={hex}
                      onChange={e => {
                        const next = [...rescueColors];
                        next[i] = e.target.value.toUpperCase();
                        setRescueColors(next);
                      }}
                      className="flex-1 text-sm px-3 py-2.5 border border-plumage-border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
                    />
                    {rescueColors.length > 2 && (
                      <button onClick={() => setRescueColors(rescueColors.filter((_, j) => j !== i))} className="p-1 text-gray-300 hover:text-gray-500">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {rescueColors.length < 3 && (
                  <button
                    onClick={() => setRescueColors([...rescueColors, '#808080'])}
                    className="text-xs text-plumage-primary font-medium hover:underline"
                  >
                    + Add a third color
                  </button>
                )}
              </div>
              <button
                onClick={handleRescueMatch}
                disabled={rescueColors.filter(c => /^#[0-9A-Fa-f]{6}$/.test(c)).length < 2}
                className="w-full mt-5 py-3 bg-plumage-primary text-white rounded-xl font-medium hover:bg-plumage-primary-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Palette className="w-4 h-4" /> Rescue My Room
              </button>
            </div>
          )}

          {/* Extracting */}
          {step === 'extracting' && (
            <div className="text-center py-10">
              {photoPreview && (
                <img src={photoPreview} alt="Uploaded" className="w-40 h-40 object-cover rounded-xl mx-auto mb-4 shadow-sm" />
              )}
              <Loader2 className="w-8 h-8 text-plumage-primary mx-auto mb-3 animate-spin" />
              <p className="text-sm text-gray-500">Extracting colors...</p>
            </div>
          )}

          {/* Results */}
          {step === 'results' && (
            <div>
              {/* Extracted colors preview */}
              {(mode === 'photo' && extractedColors.length > 0) && (
                <div className="mb-5">
                  {photoPreview && (
                    <img src={photoPreview} alt="Source" className="w-full h-32 object-cover rounded-xl mb-3" />
                  )}
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Colors Found</p>
                  <div className="flex gap-1.5">
                    {extractedColors.map((c, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div
                          className="h-8 rounded-lg mb-1"
                          style={{ backgroundColor: c.hex }}
                          title={`${c.hex} (${c.percentage}%)`}
                        />
                        <p className="text-[9px] font-mono text-gray-400">{c.hex}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input colors reminder for hex/rescue mode */}
              {(mode === 'hex' || mode === 'rescue') && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Your Colors</p>
                  <div className="flex gap-2">
                    {(mode === 'hex' ? inputColors : rescueColors).map((hex, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 rounded border border-gray-200" style={{ backgroundColor: hex }} />
                        <span className="text-xs font-mono text-gray-500">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching palettes */}
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                {mode === 'rescue' ? 'Palettes That Bridge Your Colors' : 'Best Matching Palettes'}
              </p>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <button
                    key={r.bird.id}
                    onClick={() => goToResult(r.bird.id)}
                    className="w-full bg-white rounded-xl p-4 border border-plumage-border hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-plumage-primary bg-plumage-surface-alt px-1.5 py-0.5 rounded">
                            #{i + 1}
                          </span>
                          <p className="font-display text-sm text-gray-800">{r.bird.name}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                    </div>
                    <PaletteStrip colors={r.bird.colors} height="h-6" className="mb-2" clickable={false} />
                    <p className="text-xs text-gray-500 leading-relaxed">{getMatchExplanation(r)}</p>
                    {/* Show matched color pairs */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.matchedColors.slice(0, 3).map((mc, j) => (
                        <div key={j} className="flex items-center gap-0.5">
                          <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: mc.inputHex }} title={mc.inputHex} />
                          <span className="text-[9px] text-gray-300">→</span>
                          <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: mc.matchHex }} title={mc.matchName} />
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
