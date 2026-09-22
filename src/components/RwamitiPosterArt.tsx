import React, { useState } from 'react';
import { UncleRwamitiAvatar } from './UncleRwamitiAvatar';
import { LegalModal, LegalTab } from './LegalModal';
import { sound } from '../services/audio';

interface RwamitiPosterArtProps {
  variant?: 'hero' | 'avatar' | 'compact' | 'card';
  className?: string;
  allowUpload?: boolean;
}

export const RwamitiPosterArt: React.FC<RwamitiPosterArtProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);

  // AVATAR VARIANT (Used in Navbar, Episode Drawer, Twist Screen, Story Catalog)
  if (variant === 'avatar') {
    return (
      <div
        className={`relative shrink-0 rounded-full overflow-hidden ring-2 ring-[#e5a93b] shadow-lg shadow-amber-900/30 bg-[#16120e] ${className}`}
        title="Uncle Rwamiti"
      >
        <UncleRwamitiAvatar className="w-full h-full object-cover object-top" />
      </div>
    );
  }

  // FULL HERO POSTER VARIANT (Opening Screen)
  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#e5a93b]/40 shadow-2xl bg-[#090a0d] ${className}`}>
      {/* Atmospheric Header & Background */}
      <div className="relative w-full bg-gradient-to-b from-[#18110b] via-[#100e0d] to-[#08080a] p-4 sm:p-5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#e5a93b]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Tagline from the Official Poster */}
        <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e5a93b]/15 border border-[#e5a93b]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93b] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#e5a93b]">
              YOUR MOVE • INTERACTIVE
            </span>
          </div>

          <div className="text-right">
            <div className="text-[10px] sm:text-[11px] font-serif italic text-zinc-300 font-semibold leading-tight">
              Real People. Real Stories.
            </div>
            <div className="text-[10px] sm:text-[11px] font-serif italic text-[#e5a93b] font-bold">
              Bigger Conversations.
            </div>
          </div>
        </div>

        {/* Character Showcase Section */}
        <div className="flex items-center gap-3.5 sm:gap-4 my-2 relative z-10">
          {/* Permanent Photo Frame Container */}
          <div
            className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-[#e5a93b] shadow-xl shadow-amber-950/60 bg-[#16120e] transition-all"
            title="Uncle Rwamiti - Official Portrait"
          >
            <UncleRwamitiAvatar className="w-full h-full object-cover object-top" />

            <div className="absolute bottom-1 inset-x-1 py-0.5 rounded bg-black/80 text-[8px] font-black text-center text-[#e5a93b] uppercase tracking-wider backdrop-blur-xs pointer-events-none">
              UNCLE RWAMITI
            </div>
          </div>

          {/* Typography from the Official Poster */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-serif italic text-xl sm:text-2xl font-bold text-white tracking-tight">
                Uncle
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#e5a93b] tracking-wide uppercase font-sans">
                Rwamiti
              </span>
            </div>

            <p className="text-xs sm:text-sm font-serif italic text-[#e5a93b] font-bold mt-1.5 leading-snug">
              The uncle your parents probably shouldn’t have introduced you to.
            </p>
          </div>
        </div>

        {/* The Signature Yellow Brushstroke Banner: "WHAT WOULD YOU DO?" */}
        <div className="relative my-2 py-2 px-3 rounded-lg bg-[#e5a93b] text-black font-black text-center tracking-tight shadow-md transform -rotate-0.5">
          <div className="text-xs sm:text-sm uppercase font-extrabold tracking-wider">
            WHAT WOULD YOU DO?
          </div>
        </div>

        {/* Footer Strip */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center text-[10px] text-zinc-400 font-medium">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playTap();
                setLegalTab('contact');
              }}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Contact
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => {
                sound.playTap();
                setLegalTab('privacy');
              }}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => {
                sound.playTap();
                setLegalTab('terms');
              }}
              className="hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Terms
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Info Modal */}
      <LegalModal
        isOpen={legalTab !== null}
        initialTab={legalTab || 'contact'}
        onClose={() => setLegalTab(null)}
      />
    </div>
  );
};
