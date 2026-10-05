import React from 'react';
import { CatalogStory, StoryDatabaseService } from '../services/storyDatabaseService';
import { sound } from '../services/audio';

interface StreamHeroProps {
  story: CatalogStory;
  onPlay: (slug: string) => void;
  onMoreInfo: (story: CatalogStory) => void;
}

export const StreamHero: React.FC<StreamHeroProps> = ({ story, onPlay, onMoreInfo }) => {
  const progress = StoryDatabaseService.getProgress(story.slug);
  const isContinue = progress && !progress.completed && progress.node !== 'opening';

  return (
    <div className="stream-hero teen-hero relative">
      <img
        decoding="async"
        src={story.cover}
        alt={story.title}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'cover-match-you-missed.webp';
        }}
      />

      <div className="hero-copy">
        <div className="creator-seal flex items-center gap-3">
          <img decoding="async" src="rwamiti.jpg" alt="Uncle Rwamiti portrait" />
          <span>
            UNCLE RWAMITI PRESENTS
            <br />
            <small>KAMPALA, UGANDA</small>
          </span>
        </div>

        <p className="kicker">FEATURED · TEEN STORY</p>

        <h1>{story.title}</h1>

        <p>{story.description}</p>

        <div className="hero-meta">{story.reading_time || '3–5 min · estimated'}</div>

        <div className="hero-actions flex items-center gap-3">
          <button
            type="button"
            className="primary px-6 py-3 font-bold"
            onClick={() => {
              sound.playTap();
              onPlay(story.slug);
            }}
          >
            {isContinue ? 'Continue' : 'Play the story'} →
          </button>

          <button
            type="button"
            className="outline-button px-5 py-3 font-semibold"
            onClick={() => {
              sound.playTap();
              onMoreInfo(story);
            }}
          >
            More info
          </button>
        </div>
      </div>
    </div>
  );
};
