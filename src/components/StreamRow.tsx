import React from 'react';
import { CatalogStory } from '../services/storyDatabaseService';
import { sound } from '../services/audio';

interface StreamRowProps {
  title: string;
  stories: CatalogStory[];
  onSelectStory: (story: CatalogStory) => void;
}

export const StreamRow: React.FC<StreamRowProps> = ({ title, stories, onSelectStory }) => {
  if (!stories.length) return null;

  return (
    <section className="stream-row">
      <div className="row-head flex items-center justify-between">
        <h2>{title}</h2>
        <span>
          {stories.length} {stories.length === 1 ? 'STORY' : 'STORIES'} <span aria-hidden="true">↔</span>
        </span>
      </div>

      <div className="stream-rail">
        {stories.map((story) => (
          <button
            key={story.slug}
            type="button"
            className="stream-card text-left"
            onClick={() => {
              sound.playTap();
              onSelectStory(story);
            }}
            aria-label={`Open ${story.title}`}
          >
            <span className="stream-poster block relative">
              <img
                decoding="async"
                src={story.cover}
                alt={story.title}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'drawer.webp';
                }}
              />
              <small>
                {story.legacy_engine ? 'THE ORIGINAL' : story.category || 'STORY'}
              </small>
            </span>
            <strong>{story.title}</strong>
            <span>{story.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
