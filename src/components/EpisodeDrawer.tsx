import React from 'react';
import { Episode } from '../types';
import { X, Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { sound } from '../services/audio';
import { RwamitiPosterArt } from './RwamitiPosterArt';

interface EpisodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  currentEpisodeId: string;
  onSelectEpisode: (episodeId: string) => void;
  isPremiumUser: boolean;
  onOpenSubscription: () => void;
  completedEpisodeIds: string[];
}

export const EpisodeDrawer: React.FC<EpisodeDrawerProps> = ({
  isOpen,
  onClose,
  episodes,
  currentEpisodeId,
  onSelectEpisode,
  isPremiumUser,
  onOpenSubscription,
  completedEpisodeIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm h-full bg-[#0f1015] border-l border-zinc-800 flex flex-col z-10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RwamitiPosterArt variant="avatar" className="w-10 h-10" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#e5a93b] tracking-wider">
                STORY LIBRARY
              </div>
              <h2 className="text-sm font-extrabold text-white">UNCLE RWAMITI STORIES</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Episode list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-1">
            <span>Stories ({episodes.length})</span>
            <span className="text-emerald-400 font-bold">100% Free</span>
          </div>

          {episodes.map((ep) => {
            const isCurrent = ep.id === currentEpisodeId;
            const isCompleted = completedEpisodeIds.includes(ep.id);

            return (
              <div
                key={ep.id}
                onClick={() => {
                  sound.playTap();
                  onSelectEpisode(ep.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  isCurrent
                    ? 'bg-[#e5a93b]/10 border-[#e5a93b] shadow-md shadow-[#e5a93b]/5'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#e5a93b] tracking-wider uppercase">
                        EPISODE {ep.number}
                      </span>
                      {ep.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {ep.badge}
                        </span>
                      )}
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        FREE
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-[#e5a93b] transition-colors truncate">
                      {ep.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {ep.teaser}
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center shrink-0 pl-2 pt-1">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-[#e5a93b] flex items-center justify-center text-zinc-400 group-hover:text-black transition-colors">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#0d0e12] text-center text-[10px] text-zinc-500">
          The uncle your parents probably shouldn’t have introduced you to. 😉
        </div>
      </div>
    </div>
  );
};
