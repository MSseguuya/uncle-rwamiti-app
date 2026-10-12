import React, { useState, useMemo } from 'react';
import { CatalogStory } from '../services/storyDatabaseService';
import { sound } from '../services/audio';

interface SearchStoriesViewProps {
  catalog: CatalogStory[];
  onSelectStory: (story: CatalogStory) => void;
}

export const SearchStoriesView: React.FC<SearchStoriesViewProps> = ({ catalog, onSelectStory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = useMemo(() => {
    return catalog.filter((story) => {
      const matchCat =
        selectedCategory === 'All' ||
        (selectedCategory === 'Teen' && story.category === 'Teen Stories') ||
        (selectedCategory === 'Adult' && story.category === 'Adult Stories') ||
        (selectedCategory === 'Kampala Dilemmas' && story.category === 'Kampala Dilemmas');

      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        story.title.toLowerCase().includes(q) ||
        story.description.toLowerCase().includes(q) ||
        (story.keywords && story.keywords.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [catalog, searchTerm, selectedCategory]);

  return (
    <section className="browse-screen">
      <p className="kicker">DISCOVERY</p>
      <h1>
        All stories<span>.</span>
      </h1>

      <div className="search-wrap my-6">
        <input
          type="text"
          id="story-search"
          placeholder="Search titles, themes, keywords…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--surface,#1a1a1a)] border border-[var(--line,rgba(255,255,255,0.18))] text-[var(--text,#f5f3ed)] rounded focus:outline-none focus:border-[var(--yellow,#f4c900)] text-base"
        />
      </div>

      <div className="category-tabs flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {['All', 'Teen', 'Adult', 'Kampala Dilemmas'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded border transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[var(--yellow,#f4c900)] text-black border-[var(--yellow,#f4c900)]'
                : 'bg-transparent text-[var(--text,#f5f3ed)] border-[var(--line,rgba(255,255,255,0.18))] hover:border-[var(--yellow,#f4c900)]'
            }`}
            onClick={() => {
              sound.playTap();
              setSelectedCategory(cat);
            }}
          >
            {cat === 'All' ? 'All Stories' : cat === 'Kampala Dilemmas' ? 'Kampala Dilemmas' : `${cat} Stories`}
          </button>
        ))}
        <span className="text-xs font-mono text-[var(--muted,#b8b8b5)] ml-auto">
          {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state py-12 text-center">
          <h2 className="text-2xl font-bold mb-2">No matching stories.</h2>
          <p className="text-[var(--muted,#b8b8b5)] text-sm">
            Try a different search keyword or switch categories.
          </p>
        </div>
      ) : (
        <div className="result-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filtered.map((story) => (
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
