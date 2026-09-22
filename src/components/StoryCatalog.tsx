import React from 'react';
import { Episode } from '../types';
import { sound } from '../services/audio';
import { Lock, Play, CheckCircle2, Home } from 'lucide-react';
import { RwamitiPosterArt } from './RwamitiPosterArt';

interface StoryCatalogProps {
  episodes: Episode[];
  onSelectEpisode: (episodeId: string) => void;
  onOpenSubscription: (episode: Episode) => void;
  isPremiumUser: boolean;
  completedEpisodeIds: string[];
  onBackToOpening: () => void;
  onTogglePremium?: () => void;
}

export const StoryCatalog: React.FC<StoryCatalogProps> = ({
  episodes,
  onSelectEpisode,
  onOpenSubscription,
  isPremiumUser,
  completedEpisodeIds,
  onBackToOpening,
  onTogglePremium,
}) => {
  const publishedEpisodes = episodes.filter((ep) => ep.published !== false);
  const displayEpisodes = publishedEpisodes.length > 0 ? publishedEpisodes : episodes;

  const handleEpisodeClick = (episode: Episode) => {
    sound.playTap();
    const num = parseInt(episode.number, 10);
    const isEpPremium = !isNaN(num) ? num >= 6 : !!episode.isPremium;
    if (isEpPremium && !isPremiumUser) {
      // Locked behind YOUR MOVE+ -> Opens subscription/payment
      onOpenSubscription(episode);
    } else {
      // Free or unlocked -> Play directly
      onSelectEpisode(episode.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <RwamitiPosterArt variant="avatar" className="w-9 h-9" allowUpload={false} />
          <div>
            <div className="text-[10px] font-bold text-[#e5a93b] uppercase tracking-wider">
              UNCLE RWAMITI STORIES
            </div>
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
              CHOOSE YOUR DILEMMA
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onBackToOpening();
          }}
          className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1 text-xs"
          title="Back to Opening Screen"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Home</span>
        </button>
      </div>

      {/* Access status bar with instant test toggle */}
      <div className="my-2.5 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Status:</span>
          {isPremiumUser ? (
            <span className="text-[11px] font-extrabold text-[#e5a93b] flex items-center gap-1 truncate">
              YOUR MOVE+ SUBSCRIBER (All Stories Unlocked)
            </span>
          ) : (
            <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 truncate">
              FREE VISITOR (001–005 Free • 006–012 Locked)
            </span>
          )}
        </div>
        {onTogglePremium && (
          <button
            onClick={() => {
              sound.playTap();
              onTogglePremium();
            }}
            className="text-[10px] font-bold text-zinc-300 hover:text-white px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer border border-zinc-700/60 shrink-0"
            title="Toggle subscriber status for testing"
          >
            {isPremiumUser ? 'Test as Free Visitor' : 'Test as Subscribed'}
          </button>
        )}
      </div>

      {/* Unified Episode List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 mt-1 pb-4">
        {displayEpisodes.map((ep) => {
          const isCompleted = completedEpisodeIds.includes(ep.id);
          const num = parseInt(ep.number, 10);
          const isEpPremium = !isNaN(num) ? num >= 6 : !!ep.isPremium;
          const isLocked = isEpPremium && !isPremiumUser;

          return (
            <div
              key={ep.id}
              onClick={() => handleEpisodeClick(ep)}
              className={`group relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isLocked
                  ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                  : 'bg-zinc-900 border-zinc-800 hover:border-[#e5a93b] hover:bg-zinc-800/80'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-zinc-500 font-mono">
                    EPISODE {ep.number}
                  </span>

                  {/* Tags */}
                  {!isEpPremium ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      FREE STORY
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#e5a93b]/15 text-[#e5a93b] border border-[#e5a93b]/40">
                      <Lock className="w-2.5 h-2.5" />
                      SUBSCRIBE
                    </span>
                  )}

                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-zinc-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Completed
                    </span>
                  )}
                </div>

                <h3
                  className={`text-sm font-extrabold transition-colors truncate ${
                    isLocked
                      ? 'text-zinc-200 group-hover:text-white'
                      : 'text-white group-hover:text-[#e5a93b]'
                  }`}
                >
                  {ep.title}
                </h3>

                <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                  {ep.teaser}
                </p>
              </div>

              {/* Action Indicator */}
              <div className="shrink-0 flex items-center">
                {isLocked ? (
                  <div className="w-9 h-9 rounded-lg bg-zinc-800/90 text-zinc-400 border border-zinc-700/60 flex items-center justify-center group-hover:text-[#e5a93b] group-hover:border-[#e5a93b]/50 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 text-zinc-300 group-hover:bg-[#e5a93b] group-hover:text-black transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
