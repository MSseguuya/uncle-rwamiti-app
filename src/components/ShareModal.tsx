import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { Episode } from '../types';
import { sound } from '../services/audio';
import { AnalyticsService } from '../services/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  episode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the shareable direct link
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  const shareUrl = `${currentUrl}?episode=${episode.number}&ref=challenge`;

  const shareText = episode.sharePrompt || `I just played Episode ${episode.number}: ${episode.title} on Uncle Rwamiti. What would you do?`;
  const fullSharePayload = `${shareText}\n\n👉 Test your move here:\n${shareUrl}`;

  const handleWhatsAppShare = () => {
    sound.playTap();
    AnalyticsService.track('challenge_friend_clicked', {
      episodeId: episode.id,
      metadata: { channel: 'whatsapp' },
    });
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullSharePayload)}`;
    window.open(waUrl, '_blank');
  };

  const handleNativeShare = async () => {
    sound.playTap();
    AnalyticsService.track('challenge_friend_clicked', {
      episodeId: episode.id,
      metadata: { channel: 'native_share' },
    });
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Uncle Rwamiti: ${episode.title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    sound.playTap();
    AnalyticsService.track('challenge_friend_clicked', {
      episodeId: episode.id,
      metadata: { channel: 'copy_link' },
    });
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#12131a] border border-zinc-700/80 rounded-2xl shadow-2xl p-6 text-zinc-100">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="text-[10px] uppercase font-bold text-[#e5a93b] tracking-wider mb-1">
            CHALLENGE A FRIEND
          </div>
          <h3 className="text-lg font-black text-white">
            What Would They Do?
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Send this dilemma to your friends on WhatsApp and see if they make the same move.
          </p>
        </div>

        {/* Preview snippet card */}
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 mb-5 text-left">
          <div className="text-[9px] font-bold text-[#e5a93b] uppercase tracking-wider mb-1">
            EPISODE {episode.number} • {episode.title}
          </div>
          <p className="text-xs text-zinc-300 italic">
            “{episode.teaser}”
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Native Phone Share if supported */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>More Share Options</span>
            </button>
          )}

          {/* Copy Direct Link */}
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Direct Episode Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
