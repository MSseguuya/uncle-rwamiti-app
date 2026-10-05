import React from 'react';
import { CatalogStory, StoryDatabaseService } from '../services/storyDatabaseService';
import { sound } from '../services/audio';

interface TeenStoriesSectionProps {
  stories: CatalogStory[];
  onPlay: (slug: string) => void;
  onMoreInfo?: (story: CatalogStory) => void;
}

export const TeenStoriesSection: React.FC<TeenStoriesSectionProps> = ({ stories, onPlay }) => {
  return (
    <section className="teen-section" aria-labelledby="teen-heading">
      <div className="teen-heading">
        <div>
          <p className="kicker">START HERE · PLAY FREE</p>
          <h2 id="teen-heading">Teen Stories</h2>
          <p>
            Stories about choices and their consequences, for teenagers and adults. Choose a teen story to begin.
          </p>
        </div>
      </div>

      <div className="teen-grid">
        {stories.map((x, i) => {
          const progress = StoryDatabaseService.getProgress(x.slug);
          const isDone = progress?.completed;

          return (
            <button
              key={x.slug}
              type="button"
              className="teen-card text-left"
              onClick={() => {
                sound.playTap();
                onPlay(x.slug);
              }}
              aria-label={`Play ${x.title}`}
            >
              <span className="teen-cover relative block">
                <img
                  decoding="async"
                  src={x.cover}
                  alt={x.title}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'drawer.webp';
                  }}
                />
                <small>
                  {String(i + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}
                </small>
              </span>

              <span className="teen-card-copy block">
                <strong>{x.title}</strong>
                <span>{x.description}</span>
                <em>
                  {isDone ? 'View ending' : 'Play story'} · {x.reading_time || '3–5 min'}{' '}
                  <span aria-hidden="true">→</span>
                </em>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
