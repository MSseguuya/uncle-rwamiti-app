import React, { useState } from 'react';
import { sound } from '../services/audio';
import { AnalyticsService, AGE_BRACKETS, GENDER_OPTIONS, UGANDA_DISTRICTS } from '../services/analytics';
import { AgeBracket, GenderType, PlayerDemographics } from '../types';
import { RwamitiPosterArt } from './RwamitiPosterArt';
import { Sparkles, MapPin, User, Check, X, Shield } from 'lucide-react';

interface DemographicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (demo: PlayerDemographics) => void;
}

export const DemographicsModal: React.FC<DemographicsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const currentDemo = AnalyticsService.getPlayerDemographics();
  const [selectedAge, setSelectedAge] = useState<AgeBracket>(
    currentDemo.ageBracket !== 'Undisclosed' ? currentDemo.ageBracket : '13–17 (Teens)'
  );
  const [selectedGender, setSelectedGender] = useState<GenderType>(
    currentDemo.gender || 'Female'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(
    currentDemo.location || 'Kampala (Central / Nakawa / Kawempe / Makindye / Rubaga)'
  );

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playTap();
    const updated = AnalyticsService.savePlayerDemographics({
      ageBracket: selectedAge,
      gender: selectedGender,
      location: selectedLocation,
    });
    onSaved(updated);
    onClose();
  };

  const handleSkip = () => {
    sound.playTap();
    const anonymous = AnalyticsService.savePlayerDemographics({
      ageBracket: 'Undisclosed',
      gender: 'Prefer not to say',
      location: selectedLocation || 'Kampala',
    });
    onSaved(anonymous);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121319] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl my-auto">
        {/* Header */}
        <div className="p-4 bg-gradient-to-b from-zinc-850 to-[#121319] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RwamitiPosterArt variant="avatar" className="w-10 h-10 ring-2 ring-[#e5a93b]" allowUpload={false} />
            <div>
              <span className="text-[10px] font-bold text-[#e5a93b] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AUDIENCE INSIGHTS
              </span>
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                WHO IS MAKING THE MOVE?
              </h3>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close / Play Anonymously"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-zinc-300 leading-relaxed">
            Help Uncle Rwamiti understand who is in the hot seat. This powers the real-time community statistics across Uganda.
          </p>

          {/* 1. Age Bracket */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#e5a93b]" />
              <span>What is your age bracket?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AGE_BRACKETS.map((bracket) => {
                const isSelected = selectedAge === bracket;
                return (
                  <button
                    key={bracket}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setSelectedAge(bracket);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#e5a93b]/15 border-[#e5a93b] text-white shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{bracket}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#e5a93b]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Gender */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gender</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map((g) => {
                const isSelected = selectedGender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setSelectedGender(g);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Location / District */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Where are you playing from? (District / Region)</span>
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                sound.playTap();
                setSelectedLocation(e.target.value);
              }}
              className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-medium focus:outline-none focus:border-[#e5a93b] cursor-pointer"
            >
              {UGANDA_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Note */}
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-2 text-[10px] text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              100% Anonymized for community dilemma analytics. No phone number or identity is required.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Skip / Anonymous
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md text-center"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
