import React from 'react';
import { CatalogStory } from '../services/storyDatabaseService';
import { sound } from '../services/audio';

interface MyListViewProps {
  savedStories: CatalogStory[];
  onSelectStory: (story: CatalogStory) => void;
  onBrowse: () => void;
}

export const MyListView: React.FC<MyListViewProps> = ({
  savedStories,
  onSelectStory,
  onBrowse,
}) => {
  return (
    <section className="browse-screen">
      <p className="kicker">YOUR COLLECTION</p>
      <h1>
        My List<span>.</span>
      </h1>

      {savedStories.length === 0 ? (
        <div className="empty-state py-12 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Nothing saved yet.</h2>
          <p className="text-[var(--muted,#b8b8b5)] text-sm mb-6 leading-relaxed">
            Open any story and tap + My List to keep it here for quick access.
          </p>
          <button
            type="button"
            className="primary px-6 py-3 font-bold text-sm"
            onClick={() => {
              sound.playTap();
              onBrowse();
            }}
          >
            Browse stories →
          </button>
        </div>
      ) : (
        <div className="result-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
          {savedStories.map((story) => (
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
      )}
    </section>
  );
};
