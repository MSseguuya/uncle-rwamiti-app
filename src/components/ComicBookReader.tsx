import React, { useState, useEffect, useRef } from 'react';
import { ComicBook, ComicPage } from '../types';
import { AnalyticsService } from '../services/analytics';
import { sound } from '../services/audio';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Share2,
  BookOpen,
  Scroll,
  Smartphone,
  Type,
  Download,
  Check,
  Vote,
  Sparkles,
  Clock,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Compass,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getComicShareUrl } from '../services/shareUtils';

interface ComicBookReaderProps {
  comic: ComicBook;
  onBackToLibrary: () => void;
  onShare: (comic: ComicBook) => void;
}

export const ComicBookReader: React.FC<ComicBookReaderProps> = ({
  comic,
  onBackToLibrary,
  onShare,
}) => {
  // Reading Mode: 'stacked' (vertical panels for phones), 'flip' (one page at a time), or 'scroll' (continuous page view)
  const [readingMode, setReadingMode] = useState<'stacked' | 'flip' | 'scroll'>('stacked');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pageReadSet, setPageReadSet] = useState<Set<number>>(() => new Set([1]));

  // Active reading time tracking
  const activeStartRef = useRef<number>(Date.now());
  const activeAccumulatorRef = useRef<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const pages: ComicPage[] = comic.pages || [];
  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex] || pages[0];
  const isFinalPage = currentPageIndex === totalPages - 1;

  const getActiveSeconds = () => {
    const currentRun = Math.round((Date.now() - activeStartRef.current) / 1000);
    return activeAccumulatorRef.current + Math.max(0, currentRun);
  };

  // Record initial view in behavioral analytics
  useEffect(() => {
    activeStartRef.current = Date.now();
    activeAccumulatorRef.current = 0;
    AnalyticsService.recordComicStarted(comic.slug, comic.title);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        activeStartRef.current = Date.now();
      } else {
        const elapsed = Math.round((Date.now() - activeStartRef.current) / 1000);
        activeAccumulatorRef.current += Math.max(0, elapsed);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [comic.slug, comic.title]);

  // Keyboard navigation for flip mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readingMode === 'flip') {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          handleNextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          handlePrevPage();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, readingMode, totalPages]);

  const recordPageProgress = (targetPageNum: number) => {
    setPageReadSet((prev) => new Set([...prev, targetPageNum]));
    AnalyticsService.recordComicPanelRead({
      comicId: comic.slug,
      panelNumber: targetPageNum,
      totalPanels: totalPages,
      activeTimeSeconds: getActiveSeconds(),
      comicTitle: comic.title,
      choiceLabel: `Read ${pages[targetPageNum - 1]?.label || `Page ${targetPageNum}`}`,
    });

    if (targetPageNum === totalPages) {
      AnalyticsService.recordComicCompleted({
        comicId: comic.slug,
        comicTitle: comic.title,
        choicesCount: pageReadSet.size,
        activeTimeSeconds: getActiveSeconds(),
        endingTitle: `Finished ${comic.title} (Issue #${comic.issueNumber})`,
      });
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      sound.playTap();
      const nextIdx = currentPageIndex + 1;
      setCurrentPageIndex(nextIdx);
      setZoomLevel(1);
      recordPageProgress(nextIdx + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      sound.playTap();
      setCurrentPageIndex(currentPageIndex - 1);
      setZoomLevel(1);
    }
  };

  const handleJumpToPage = (idx: number) => {
    sound.playTap();
    setCurrentPageIndex(idx);
    setZoomLevel(1);
    recordPageProgress(idx + 1);

    if (readingMode === 'scroll') {
      const pageEl = document.getElementById(`comic-page-${idx + 1}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Touch Swipe gestures for mobile users
  const handleTouchStart = (e: React.TouchEvent) => {
    if (readingMode !== 'flip') return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (readingMode !== 'flip' || touchStartXRef.current === null || touchStartYRef.current === null)
      return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNextPage();
      } else {
        handlePrevPage();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const handlePollVote = (option: string) => {
    sound.playTap();
    setPollVoted(option);
    AnalyticsService.recordChoiceSelected('poll', option, comic.title);
    AnalyticsService.completeRealGameSession({
      episodeId: comic.slug,
      episodeTitle: comic.title,
      choicesCount: 1,
      pollOption: option,
      activeTimeSeconds: getActiveSeconds(),
      endingTitle: `Voted on ${comic.title} Poll`,
    });
  };

  const handleWhatsAppShare = () => {
    sound.playTap();
    const shareUrl = getComicShareUrl(comic.slug);
    const message = `📖 *${comic.title}* (Issue #${comic.issueNumber})\n${comic.description}\nWhat would you do? Start reading the comic on Uncle Rwamiti: Your Move 👉 ${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    AnalyticsService.recordChoiceSelected('share', 'whatsapp', comic.title);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const progressPercent = Math.min(
    100,
    Math.round(((currentPageIndex + 1) / totalPages) * 100)
  );

  // Render the ending section, Uncle Rwamiti verdict, and Reader Participation
  const renderVerdictAndParticipation = () => (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#12141c] border-2 border-amber-500/60 shadow-2xl my-8 space-y-6">
      {/* Uncle Rwamiti's Verdict */}
      <div className="flex items-start gap-4">
        <img
          src="rwamiti.jpg"
          alt="Uncle Rwamiti"
          className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 flex-shrink-0 shadow-lg"
        />
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
            UNCLE RWAMITI'S VERDICT
          </span>
          <p className="text-base sm:text-lg font-serif italic text-white mt-2 leading-relaxed">
            “{comic.rwamitiWisdom}”
          </p>
        </div>
      </div>

      {/* Reader Participation: Your Move Question */}
      <div className="pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-2 text-amber-400">
          <Vote className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm sm:text-base font-mono font-black uppercase tracking-wider">
            YOUR MOVE: WHAT WOULD YOU HAVE DONE?
          </h3>
        </div>
        <p className="text-xs text-zinc-300 font-sans mb-4">
          {comic.closingQuestion}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(comic.pollOptions || []).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handlePollVote(opt)}
              className={`p-3.5 rounded-2xl text-xs font-mono font-bold border transition cursor-pointer flex items-center justify-between text-left ${
                pollVoted === opt
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-[1.01]'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-amber-400/80 hover:text-white'
              }`}
            >
              <span>{opt}</span>
              {pollVoted === opt && <Check className="w-4 h-4 ml-2 flex-shrink-0" />}
            </button>
          ))}
        </div>

        {pollVoted && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>✓ Your move has been recorded in live behavioral analytics!</span>
          </div>
        )}
      </div>

      {/* One Possible Path Reflection */}
      <div className="pt-6 border-t border-zinc-800">
        <div className="flex items-center gap-2 text-amber-300 mb-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
            ONE POSSIBLE PATH
          </h4>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">
          In this comic, Alex asked Mum &amp; Dad and chose Kigo Initiative’s data task. As Uncle Rwamiti reminds us: twenty thousand shillings entered as transport money and left as a family meeting.
        </p>
      </div>

      {/* WhatsApp Share Card */}
      <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={comic.coverImage}
            alt={comic.title}
            className="w-12 h-16 object-cover rounded-lg border border-zinc-700 shadow-md flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase">
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Share on WhatsApp with Cover Preview</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Share this Kampala Dilemma
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sends with cover artwork thumbnail. Tapping the link opens this comic book directly!
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/25 whitespace-nowrap"
        >
          <WhatsAppIcon className="w-4 h-4 text-white" />
          <span>Share on WhatsApp</span>
        </button>
      </div>

      {/* Back and Top Navigation */}
      <div className="pt-4 border-t border-zinc-800 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold uppercase transition cursor-pointer text-center"
        >
          Scroll to Top
        </button>
        <button
          type="button"
          onClick={onBackToLibrary}
          className="py-3 px-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs font-bold transition cursor-pointer"
        >
          Back to Comics Library
        </button>
      </div>
    </div>
  );

  return (
    <div className="comic-flipper-container min-h-screen bg-[#06070a] text-[#f5f3ed] flex flex-col select-none">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#0d0e14]/95 backdrop-blur-md border-b border-zinc-800 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onBackToLibrary();
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-400 text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer"
            aria-label="Back to comics library"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">LIBRARY</span>
          </button>

          <div className="truncate max-w-[140px] sm:max-w-md">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block leading-none">
              {comic.series} · {comic.pathLabel || 'ONE POSSIBLE PATH'}
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-white truncate leading-tight">
              {comic.title}
            </h1>
          </div>
        </div>

        {/* Center / Right Mode & Readability Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reading Mode Switcher: STACKED (Phone) | FLIP | SCROLL */}
          <div className="flex items-center p-0.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-bold">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setReadingMode('stacked');
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                readingMode === 'stacked'
                  ? 'bg-amber-500 text-black shadow font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Stacked Panels for Phone Reading"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>STACKED</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setReadingMode('flip');
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                readingMode === 'flip'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Flippable Page-by-Page View"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">FLIP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setReadingMode('scroll');
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                readingMode === 'scroll'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Smooth Continuous Scrolling View"
            >
              <Scroll className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PAGES</span>
            </button>
          </div>

          {/* Text Size Toggle Button for Phone Readability */}
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setIsLargeText((prev) => !prev);
            }}
            className={`p-1.5 px-2.5 rounded-lg border text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
              isLargeText
                ? 'bg-amber-500 text-black border-amber-400 shadow'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
            title="Toggle Large Message Text for Phones"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="text-[10px]">{isLargeText ? 'TEXT L' : 'TEXT M'}</span>
          </button>

          {/* Page Counter Badge (in flip mode) */}
          {readingMode === 'flip' && (
            <div className="hidden sm:block px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-amber-400 whitespace-nowrap">
              <span>
                {currentPageIndex === 0 ? 'Cover' : `Page ${currentPageIndex}`} / {totalPages - 1}
              </span>
            </div>
          )}

          {/* Direct PDF Link */}
          {comic.pdfUrl && (
            <a
              href={comic.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition"
              title="Open / Download Original PDF"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          {/* Direct WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Share on WhatsApp with Cover Thumbnail Preview"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => onShare(comic)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer"
            title="More Share Options"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Editorial Banner: One Possible Path + Sam Note on Cover */}
      <div className="bg-[#10131c] border-b border-amber-500/20 px-3 sm:px-6 py-2 text-xs font-mono text-zinc-300 flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold uppercase text-[9px] tracking-wider border border-amber-500/40">
            ONE POSSIBLE PATH
          </span>
          <span className="text-zinc-200 font-semibold">
            Route: Mum’s Prescription &amp; The Freelance Task
          </span>
        </div>
        <div className="text-[11px] text-zinc-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>Cover Note: Friend Sam appears on cover but belongs to an alternative borrowing branch.</span>
        </div>
      </div>

      {/* Reading Progress Indicator */}
      <div className="w-full h-1 bg-zinc-900">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ======================================================== */}
      {/* MODE 1: STACKED PANELS (Webtoon Vertical Phone Reading) */}
      {/* ======================================================== */}
      {readingMode === 'stacked' && (
        <div className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-6 py-6 space-y-8">
          {comic.panels.map((p, pIdx) => (
            <article
              key={p.id}
              className="bg-[#0e1017] border-2 border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl transition hover:border-zinc-700"
            >
              {/* Panel Top Header: Day & Time + Setting */}
              <div className="bg-[#141722] px-4 py-3 border-b border-zinc-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase border border-amber-500/30">
                    {p.dayMarker || `PANEL ${pIdx + 1}`}
                  </span>
                  {p.timeMarker && (
                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-200 font-mono text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{p.timeMarker}</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  {p.settingDescription || `Panel ${pIdx + 1} of ${comic.panels.length}`}
                </span>
              </div>

              {/* Panel Image */}
              {p.imageUrl && (
                <div className="relative bg-black border-b border-zinc-800/80 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.caption || `Panel ${p.panelNumber}`}
                    className="w-full h-auto max-h-[460px] object-contain block mx-auto"
                    loading={pIdx <= 2 ? 'eager' : 'lazy'}
                  />
                </div>
              )}

              {/* Setting & Narrative Caption */}
              {p.caption && (
                <div className="p-4 bg-[#11131c] border-b border-zinc-800/60 text-xs font-mono text-zinc-300 leading-relaxed">
                  {p.caption}
                </div>
              )}

              {/* Timing Clash Warning Callout (Panel 4) */}
              {p.clashReason && (
                <div className="m-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs font-mono leading-relaxed flex items-start gap-2.5 shadow-md">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block uppercase text-[10px] tracking-wider text-amber-400 mb-1">
                      TIMING CONFLICT: WHY BOTH CANNOT BE COMPLETED
                    </strong>
                    <span>{p.clashReason}</span>
                  </div>
                </div>
              )}

              {/* Resolution Note Callout (Panel 3) */}
              {p.resolutionNote && (
                <div className="m-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs font-mono leading-relaxed flex items-start gap-2.5 shadow-md">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block uppercase text-[10px] tracking-wider text-emerald-400 mb-1">
                      MUM’S PRESCRIPTION RESTORED
                    </strong>
                    <span>{p.resolutionNote}</span>
                  </div>
                </div>
              )}

              {/* Dialogue Bubbles (Phone-Optimized, Large Readable Typography) */}
              {p.dialogue && p.dialogue.length > 0 && (
                <div className="p-4 sm:p-5 space-y-3.5 bg-[#0a0c12]">
                  {p.dialogue.map((d, dIdx) => {
                    const isAlex = d.character === 'Alex';
                    const isAisha = d.character === 'Aisha';
                    const isMum = d.character === 'Mum';
                    const isDad = d.character === 'Dad';
                    const isMoMo = d.character === 'MTN Mobile Money';
                    const isClient = d.character.includes('Kigo') || d.character.includes('Client');
                    const isBrightpath = d.character.includes('Brightpath');

                    return (
                      <div
                        key={dIdx}
                        className={`flex flex-col ${
                          d.side === 'right' ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* Character Name & Role Badge with distinct colors */}
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span
                            className={`text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isAisha
                                ? 'bg-teal-500/25 text-teal-300 border border-teal-500/50'
                                : isMum
                                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50'
                                : isDad
                                ? 'bg-slate-700/50 text-slate-200 border border-slate-500/40'
                                : isAlex
                                ? 'bg-blue-500/25 text-blue-300 border border-blue-500/50'
                                : isMoMo
                                ? 'bg-yellow-500/25 text-yellow-300 border border-yellow-500/50'
                                : isClient
                                ? 'bg-purple-500/25 text-purple-300 border border-purple-500/50'
                                : 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/50'
                            }`}
                          >
                            {d.character}
                          </span>
                          {d.characterRole && (
                            <span className="text-[9px] font-mono text-zinc-400">
                              {d.characterRole}
                            </span>
                          )}
                        </div>

                        {/* Speech Bubble Card */}
                        <div
                          className={`max-w-[94%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-md border ${
                            d.bubbleType === 'thought'
                              ? 'border-dashed border-zinc-700 bg-zinc-900/90 text-zinc-200 italic'
                              : isAisha
                              ? 'bg-[#0b2420] border-teal-500/50 text-teal-50'
                              : isMum
                              ? 'bg-[#291d0a] border-amber-500/50 text-amber-50'
                              : isDad
                              ? 'bg-[#181c26] border-slate-600/50 text-slate-100'
                              : isMoMo
                              ? 'bg-[#2b2207] border-yellow-500/50 text-yellow-100 font-mono'
                              : isClient
                              ? 'bg-[#1e1329] border-purple-500/50 text-purple-100'
                              : isBrightpath
                              ? 'bg-[#101b33] border-blue-500/50 text-blue-100'
                              : 'bg-[#151722] border-zinc-700 text-zinc-100'
                          } ${
                            isLargeText
                              ? 'text-base sm:text-lg leading-relaxed'
                              : 'text-xs sm:text-sm leading-normal'
                          }`}
                        >
                          <p className="font-sans whitespace-pre-line font-medium">
                            {d.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          ))}

          {/* Uncle Rwamiti Conclusion & Reader Participation at the end of Stacked View */}
          {renderVerdictAndParticipation()}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: FLIPPABLE COMIC BOOK (Swipe / Click Page Flip)  */}
      {/* ======================================================== */}
      {readingMode === 'flip' && (
        <div
          className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden relative touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Book Stage Container */}
          <div className="relative w-full max-w-2xl flex flex-col items-center">
            {/* Flippable Page Card */}
            <div
              className="relative w-full rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden bg-black border border-zinc-800 transition-all duration-300 flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <img
                src={currentPage.image}
                alt={currentPage.label}
                className="w-full h-auto max-h-[80vh] object-contain block mx-auto transition-opacity duration-300 pointer-events-none"
                loading="eager"
              />

              {/* Tap Zones for Quick Flipping on Mobile & Desktop */}
              <div
                onClick={handlePrevPage}
                className="absolute left-0 top-0 w-1/3 h-full cursor-w-resize z-20 group"
                title="Tap to flip to previous page"
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-zinc-700 text-white opacity-0 group-hover:opacity-90 sm:group-hover:opacity-90 transition">
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </div>

              <div
                onClick={handleNextPage}
                className="absolute right-0 top-0 w-1/3 h-full cursor-e-resize z-20 group"
                title="Tap to flip to next page"
              >
                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 backdrop-blur-sm border border-zinc-700 text-white opacity-0 group-hover:opacity-90 sm:group-hover:opacity-90 transition">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {/* Floating Page Label Badge */}
              <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-400 font-mono text-[10px] font-bold border border-zinc-700">
                  {currentPage.label}
                </span>
                {currentPage.timeMarker && (
                  <span className="px-2.5 py-1 rounded-full bg-zinc-900/90 backdrop-blur-md text-zinc-300 font-mono text-[9px] font-bold border border-zinc-700">
                    {currentPage.timeMarker}
                  </span>
                )}
              </div>

              {/* Zoom Toggle Floating Button */}
              <div className="absolute bottom-3 right-3 z-30">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => (z === 1 ? 1.4 : 1))}
                  className="p-2 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 hover:text-white border border-zinc-700 transition cursor-pointer"
                  title="Toggle Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Page Caption Box */}
            {currentPage.caption && (
              <div className="w-full mt-3 p-3.5 rounded-xl bg-[#0f1118] border border-zinc-800 text-xs font-mono text-zinc-300 leading-relaxed shadow-lg">
                <p>{currentPage.caption}</p>
                {currentPage.keyMoments && (
                  <ul className="mt-2 space-y-1 text-[11px] text-zinc-400">
                    {currentPage.keyMoments.map((km, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{km}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Uncle Rwamiti Conclusion at the end of Flip Mode */}
            {isFinalPage && renderVerdictAndParticipation()}
          </div>

          {/* Bottom Flip Navigation Bar & Thumbnail Scrubber */}
          <div className="sticky bottom-0 z-40 w-full max-w-2xl mt-4 bg-[#0d0f14]/95 backdrop-blur-md p-3 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3 shadow-xl">
            <button
              type="button"
              disabled={currentPageIndex === 0}
              onClick={handlePrevPage}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition ${
                currentPageIndex === 0
                  ? 'opacity-30 cursor-not-allowed text-zinc-500'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">PREV</span>
            </button>

            {/* Thumbnail / Page Jump Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 scrollbar-none">
              {pages.map((p, idx) => (
                <button
                  key={p.pageNumber}
                  type="button"
                  onClick={() => handleJumpToPage(idx)}
                  className={`h-7 px-2.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center ${
                    idx === currentPageIndex
                      ? 'bg-amber-500 text-black'
                      : pageReadSet.has(idx + 1)
                      ? 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                      : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={p.label}
                >
                  {idx === 0 ? 'Cover' : idx}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={isFinalPage}
              onClick={handleNextPage}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition ${
                isFinalPage
                  ? 'opacity-30 cursor-not-allowed text-zinc-500'
                  : 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer shadow-lg shadow-amber-500/20'
              }`}
            >
              <span className="hidden sm:inline">NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: SMOOTH SCROLLING (Page-by-Page Vertical Scroll) */}
      {/* ======================================================== */}
      {readingMode === 'scroll' && (
        <div
          ref={scrollContainerRef}
          className="flex-1 w-full max-w-3xl mx-auto px-2 sm:px-6 py-6 space-y-8 scroll-smooth"
        >
          {pages.map((p, idx) => (
            <div
              key={p.pageNumber}
              id={`comic-page-${p.pageNumber}`}
              className="relative bg-black border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl scroll-mt-16"
            >
              {/* Page Header Bar */}
              <div className="bg-[#12141c] px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase">
                  {p.label}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Page {idx + 1} of {totalPages}
                </span>
              </div>

              {/* Comic Page Graphic */}
              <img
                src={p.image}
                alt={p.label}
                className="w-full h-auto block object-contain"
                loading={idx <= 2 ? 'eager' : 'lazy'}
                onLoad={() => recordPageProgress(idx + 1)}
              />

              {p.caption && (
                <div className="p-3 bg-[#0d0e14] border-t border-zinc-800/80 text-xs text-zinc-300 font-mono">
                  {p.caption}
                </div>
              )}
            </div>
          ))}

          {/* Uncle Rwamiti Conclusion at the end of scroll */}
          {renderVerdictAndParticipation()}
        </div>
      )}
    </div>
  );
};
