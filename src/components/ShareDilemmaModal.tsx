import React, { useState } from 'react';
import { CatalogStory } from '../services/storyDatabaseService';
import { sound } from '../services/audio';
import { AnalyticsService } from '../services/analytics';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  getComicShareUrl,
  getStoryShareUrl,
  PUBLIC_COMIC_COVER_THUMBNAIL_URL,
} from '../services/shareUtils';
import { Check, Copy, ExternalLink, Sparkles, BookOpen, Info } from 'lucide-react';

interface ShareDilemmaModalProps {
  story: CatalogStory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDilemmaModal: React.FC<ShareDilemmaModalProps> = ({ story, isOpen, onClose }) => {
  const [status, setStatus] = useState<string>('');

  if (!isOpen || !story) return null;

  const isComic = story.category === 'Comics' || story.slug === 'send-me-something-small';
  const shareUrl = isComic
    ? getComicShareUrl(story.slug)
    : getStoryShareUrl(story.slug);

  const shareMessage = isComic
    ? `📖 *${story.title}* (Interactive Comic Book)\n${story.description}\nWhat would you do? Start reading the flippable comic on Uncle Rwamiti: Your Move 👉`
    : `${story.title} — ${story.description} What would you do? | Uncle Rwamiti:`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareMessage} ${shareUrl}`);
      setStatus('✓ Direct link copied to clipboard!');
      sound.playTap();
      AnalyticsService.recordChoiceSelected('share', 'copy_link', story.title);
      setTimeout(() => setStatus(''), 4000);
    } catch {
      setStatus('Please copy the link below.');
    }
  };

  const handleShare = async (service: string) => {
    sound.playTap();
    AnalyticsService.recordChoiceSelected('share', service, story.title);

    const fullText = `${shareMessage} ${shareUrl}`;
    const encodedMsg = encodeURIComponent(fullText);
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
      <div className="share-panel max-w-lg w-full bg-[#11131a] border-2 border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <div className="settings-head flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              {isComic ? 'COMIC BOOK SHARING' : 'STORY DILEMMA'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isComic ? 'Share Comic on WhatsApp' : 'Share the dilemma.'}
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            aria-label="Close sharing"
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            ✕
          </button>
        </div>

        {/* WhatsApp Preview Card simulation */}
        <div className="my-5 p-3.5 rounded-2xl bg-[#0a0c10] border border-zinc-800 flex gap-3.5 items-start">
          <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-black border border-zinc-700/80 shadow-md">
            <img
              src={story.cover}
              alt={story.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'assets/comic-pages/page-1.jpg';
              }}
            />
            {isComic && (
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/90 text-amber-300 font-mono text-[8px] font-bold">
                COMIC
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp Thumbnail Preview</span>
            </div>
            <strong className="block text-sm sm:text-base font-bold text-white line-clamp-1">
              {story.title}
            </strong>
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {story.description}
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
              <BookOpen className="w-3 h-3 text-amber-400" />
              <span>Opens directly in reader</span>
            </div>
          </div>
        </div>

        {/* Primary WhatsApp Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleShare('whatsapp')}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-mono text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition shadow-lg shadow-emerald-500/25 cursor-pointer"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
            <span>SHARE ON WHATSAPP NOW</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
          </button>

          <p className="text-[11px] font-mono text-zinc-400 text-center">
            When shared on WhatsApp, recipients see the cover thumbnail card and start reading upon tapping.
          </p>
        </div>

        {/* Other Share Channels */}
        <div className="mt-6 pt-5 border-t border-zinc-800">
          <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 block mb-3">
            Or share via other platforms:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleShare('x')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition cursor-pointer text-center"
            >
              X (Twitter) ↗
            </button>
            <button
              type="button"
              onClick={() => handleShare('facebook')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition cursor-pointer text-center"
            >
              Facebook ↗
            </button>
            <button
              type="button"
              onClick={() => handleShare('linkedin')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition cursor-pointer text-center"
            >
              LinkedIn ↗
            </button>
            <button
              type="button"
              onClick={() => handleShare('native')}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition cursor-pointer text-center"
            >
              More apps ↗
            </button>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-400 truncate focus:outline-none"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase transition cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>
        </div>

        {status && (
          <p
            id="share-status"
            role="status"
            className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center"
            aria-live="polite"
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};
