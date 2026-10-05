import React from 'react';
import { CatalogStory, StoryData, StoryDatabaseService } from '../services/storyDatabaseService';
import { sound } from '../services/audio';

interface StoryDetailModalProps {
  story: CatalogStory | null;
  storyData: StoryData | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (slug: string) => void;
  onShare: (story: CatalogStory) => void;
  isSaved: boolean;
  onToggleSave: (slug: string) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  storyData,
  isOpen,
  onClose,
  onPlay,
  onShare,
  isSaved,
  onToggleSave,
}) => {
  if (!isOpen || !story) return null;

  const progress = StoryDatabaseService.getProgress(story.slug);
  const readingTime = story.reading_time || `${story.duration_minutes || 4} min · estimated`;

  const nodes = storyData?.nodes || {};
  const nodeKeys = Object.keys(nodes);
  const openingNode = nodes['opening'] || (nodeKeys.length > 0 ? nodes[nodeKeys[0]] : null);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex justify-center items-start sm:items-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playTap();
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-[var(--panel,#050505)] text-[var(--text,#f5f3ed)] min-h-screen sm:min-h-0 sm:rounded-lg overflow-hidden border border-[var(--line,rgba(255,255,255,0.12))] shadow-2xl">
        <div className="detail-hero relative">
          <img
            decoding="async"
            src={story.cover}
            alt={story.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'drawer.webp';
            }}
          />
          <button
            type="button"
            className="detail-back"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            aria-label="Back to stories"
          >
            ← Stories
          </button>
        </div>

        <article className="detail-content px-6 py-8">
          <p className="kicker">
            {story.category.toUpperCase()} · {readingTime.toUpperCase()}
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight my-2">
            {story.title}
          </h1>
          <p className="detail-description text-base sm:text-lg text-[var(--muted,#b8b8b5)] leading-relaxed my-4">
            {story.description}
          </p>

          <div className="detail-actions flex flex-wrap gap-3 my-6">
            <button
              type="button"
              className="primary flex-1 min-h-[48px] px-6 py-3 font-bold"
              onClick={() => {
                sound.playTap();
                onPlay(story.slug);
              }}
            >
              {progress && !progress.completed ? 'Continue story →' : 'Play this story →'}
            </button>

            <button
              type="button"
              className="outline-button px-5 py-3 font-semibold"
              onClick={() => {
                sound.playTap();
                onToggleSave(story.slug);
              }}
            >
              {isSaved ? '✓ Saved' : '+ My List'}
            </button>

            <button
              type="button"
              className="outline-button px-5 py-3 font-semibold"
              onClick={() => {
                sound.playTap();
                onShare(story);
              }}
            >
              Share ↗
            </button>
          </div>

          <div className="chapter-list mt-8 pt-6 border-t border-[var(--line,rgba(255,255,255,0.12))]">
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide mb-4">
              Story Scenarios
            </h2>
            <div className="space-y-3">
              <div className="chapter flex items-start gap-4 p-4 rounded bg-[var(--surface,#1a1a1a)] border border-[var(--line,rgba(255,255,255,0.08))]">
                <span className="font-mono text-xl font-bold text-[var(--yellow,#f4c900)]">
                  01
                </span>
                <span className="flex-1">
                  <strong className="block text-base font-bold">
                    {openingNode?.title || 'The discovery'}
                  </strong>
                  <small className="text-sm text-[var(--muted,#b8b8b5)]">
                    {openingNode?.summary || story.description}
                  </small>
                </span>
                <span className="text-xs font-mono font-bold uppercase text-[var(--yellow,#f4c900)]">
                  {progress && !progress.completed ? 'CURRENT' : 'READY'}
                </span>
              </div>

              <div className="chapter flex items-start gap-4 p-4 rounded bg-[var(--surface,#1a1a1a)]/50 border border-[var(--line,rgba(255,255,255,0.05))] opacity-80">
                <span className="font-mono text-xl font-bold text-[var(--muted,#666)]">
                  02
                </span>
                <span className="flex-1">
                  <strong className="block text-base font-bold">The consequence</strong>
                  <small className="text-sm text-[var(--muted,#b8b8b5)]">
                    Your next moves determine what follows and which ending unfolds.
                  </small>
                </span>
                <span className="text-xs font-mono font-bold uppercase text-[var(--muted,#888)]">
                  UP NEXT
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
