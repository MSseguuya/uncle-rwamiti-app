import React, { useState } from 'react';
import { CatalogStory } from '../services/storyDatabaseService';
import { sound } from '../services/audio';
import { AnalyticsService } from '../services/analytics';

interface ShareDilemmaModalProps {
  story: CatalogStory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDilemmaModal: React.FC<ShareDilemmaModalProps> = ({ story, isOpen, onClose }) => {
  const [status, setStatus] = useState<string>('');

  if (!isOpen || !story) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://unclerwamiti.com';
  const shareUrl = `${currentOrigin}/?story=${encodeURIComponent(story.slug)}`;
  const shareMessage = `${story.title} — ${story.description} What would you do? | Uncle Rwamiti`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
      setStatus('Link copied to clipboard!');
      sound.playTap();
      AnalyticsService.recordChoiceSelected('share', 'copy_link', story.title);
    } catch {
      setStatus('Please copy the link below.');
    }
  };

  const handleShare = async (service: string) => {
    sound.playTap();
    AnalyticsService.recordChoiceSelected('share', service, story.title);

    const encodedMsg = encodeURIComponent(shareMessage + ' ' + shareUrl);
    const targets: Record<string, string> = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodedMsg}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };

    if (targets[service]) {
      window.open(targets[service], '_blank', 'noopener,noreferrer');
      return;
    }

    if (service === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: shareMessage,
          url: shareUrl,
        });
        setStatus('Story shared.');
        return;
      } catch {
        // Ignored if user dismissed share sheet
      }
    }

    // Fallback copy
    await copyToClipboard();
  };

  return (
    <div
      className="share-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Share ${story.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playTap();
          onClose();
        }
      }}
    >
      <div className="share-panel">
        <div className="settings-head flex items-center justify-between">
          <h2>Share the dilemma.</h2>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            aria-label="Close sharing"
            className="text-2xl opacity-75 hover:opacity-100"
          >
            ✕
          </button>
        </div>

        <div className="share-preview">
          <img
            src={story.cover}
            alt={story.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'drawer.webp';
            }}
          />
          <div>
            <span>AN UNCLE RWAMITI STORY</span>
            <strong>{story.title}</strong>
            <p>{story.description}</p>
          </div>
        </div>

        <p className="share-question">
          What would you do? Send the story without revealing your ending.
        </p>

        <div className="share-grid">
          <button type="button" onClick={() => handleShare('whatsapp')}>
            WhatsApp ↗
          </button>
          <button type="button" onClick={() => handleShare('linkedin')}>
            LinkedIn ↗
          </button>
          <button type="button" onClick={() => handleShare('x')}>
            X (Twitter) ↗
          </button>
          <button type="button" onClick={() => handleShare('facebook')}>
            Facebook ↗
          </button>
          <button type="button" onClick={() => handleShare('instagram')}>
            Instagram ↗
          </button>
          <button type="button" onClick={() => handleShare('snapchat')}>
            Snapchat ↗
          </button>
          <button type="button" onClick={() => handleShare('native')}>
            More apps ↗
          </button>
          <button type="button" onClick={copyToClipboard}>
            Copy link ↗
          </button>
        </div>

        {status && (
          <p id="share-status" role="status" className="share-status" aria-live="polite">
            {status}
          </p>
        )}

        <p className="share-url">{shareUrl}</p>
      </div>
    </div>
  );
};
