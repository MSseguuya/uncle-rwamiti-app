import React from 'react';
import { RwamitiPosterArt } from './RwamitiPosterArt';
import { sound } from '../services/audio';
import { Play, Sparkles, ShieldCheck } from 'lucide-react';

interface OpeningScreenProps {
  onStart: () => void;
  totalEpisodesCount: number;
  freeEpisodesCount: number;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({
  onStart,
  totalEpisodesCount,
  freeEpisodesCount,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto animate-in fade-in duration-300">
      {/* Top Graphic Poster & Intro */}
      <div className="space-y-4">
        <RwamitiPosterArt variant="hero" />

        {/* Headline & Description */}
        <div className="space-y-2 pt-1 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
            YOUR MOVE: WHAT WOULD YOU DO?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto">
            Real life throws situations with no clean answers. Step into real dilemmas, make the call under pressure, and face Uncle Rwamiti's twist.
          </p>
        </div>

        {/* Quick Highlights / Badges */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% FREE ACCESS</span>
            </div>
            <div className="text-xs text-zinc-400">Play all 12 • No sign-up</div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center">
            <div className="text-[10px] font-bold text-[#e5a93b] uppercase tracking-wider flex items-center justify-center gap-1 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{totalEpisodesCount} COMPLETE STORIES</span>
            </div>
            <div className="text-xs text-zinc-400">Full dilemmas & twists</div>
          </div>
        </div>
      </div>

      {/* Main Call to Action Button */}
      <div className="pt-6 pb-2">
        <button
          onClick={() => {
            sound.playTap();
            onStart();
          }}
          className="w-full py-4 px-6 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-black text-base sm:text-lg uppercase tracking-wider shadow-xl shadow-[#e5a93b]/25 cursor-pointer transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>MAKE YOUR MOVE</span>
        </button>
        <p className="text-center text-[11px] text-zinc-500 mt-2.5">
          Tap to explore all stories and choose your first dilemma
        </p>
      </div>
    </div>
  );
};
