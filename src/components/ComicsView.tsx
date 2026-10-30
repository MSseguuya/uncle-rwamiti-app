import React, { useState } from 'react';
import { ComicBook } from '../types';
import { getStoredComics } from '../data/comicsData';
import { sound } from '../services/audio';
import { StoryDatabaseService } from '../services/storyDatabaseService';
import {
  BookOpen,
  Download,
  Bookmark,
  BookmarkCheck,
  Layers,
  Clock,
  ArrowRight,
  Eye,
  Sparkles,
} from 'lucide-react';
import { AnalyticsService } from '../services/analytics';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getComicShareUrl } from '../services/shareUtils';

interface ComicsViewProps {
  onSelectComic: (comic: ComicBook) => void;
  onOpenAdmin?: () => void;
}

export const ComicsView: React.FC<ComicsViewProps> = ({
  onSelectComic,
}) => {
  const [comics] = useState<ComicBook[]>(() => getStoredComics());
  const [selectedSlug, setSelectedSlug] = useState<string>(() => comics[0]?.slug || 'send-me-something-small');
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(() =>
    StoryDatabaseService.getSavedSlugs()
  );

  const currentComic = comics.find((c) => c.slug === selectedSlug) || comics[0];
  const isBookmarked = currentComic ? savedSlugs.has(currentComic.slug) : false;

  React.useEffect(() => {
    if (currentComic) {
      document.title = `${currentComic.title} · Uncle Rwamiti Comics`;
    }
  }, [currentComic]);

  const handleToggleBookmark = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    sound.playTap();
    StoryDatabaseService.toggleSaved(slug);
    setSavedSlugs(new Set(StoryDatabaseService.getSavedSlugs()));
  };

  const handleWhatsAppShare = (comic: ComicBook) => {
    sound.playTap();
    const shareUrl = getComicShareUrl(comic.slug);
    const message = `📖 *${comic.title}* (Issue #${comic.issueNumber})\n${comic.description}\nWhat would you do? Start reading the flippable comic on Uncle Rwamiti: Your Move 👉 ${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    AnalyticsService.recordChoiceSelected('share', 'whatsapp', comic.title);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!currentComic) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-zinc-400">
        <p>No comic book available.</p>
      </div>
    );
  }

  return (
    <div className="comics-library-page min-h-screen px-4 sm:px-8 py-8 max-w-6xl mx-auto space-y-10">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>COMICS LIBRARY · {comics.length} GRAPHIC ISSUES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Uncle Rwamiti Comic Series
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Flippable full-color graphic novels capturing Kampala real-life dilemmas
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleWhatsAppShare(currentComic)}
            className="px-3.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Share current comic on WhatsApp"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">SHARE THIS ISSUE</span>
          </button>

          {currentComic.pdfUrl && (
            <a
              href={currentComic.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-400 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              title="Download or view original PDF"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Issue Selector Tabs (Issues #001 to #005) */}
      <div className="border-b border-zinc-800 pb-2">
        <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SELECT AN ISSUE TO READ</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {comics.map((c) => {
            const isSelected = c.slug === currentComic.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setSelectedSlug(c.slug);
                }}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/50'
                    : 'bg-[#11131a] border-zinc-800/80 hover:border-zinc-600 hover:bg-[#151822]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span
                    className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-amber-500 text-black'
                        : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700'
                    }`}
                  >
                    ISSUE #{c.issueNumber}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {c.pageCount}p
                  </span>
                </div>
                <div
                  className={`font-bold text-xs line-clamp-1 mt-1 transition-colors ${
                    isSelected ? 'text-amber-300 font-black' : 'text-zinc-200 group-hover:text-white'
                  }`}
                >
                  {c.title}
                </div>
                <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                  {c.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Comic Card for Currently Selected Issue */}
      <div className="relative bg-gradient-to-br from-[#12141c] via-[#0d0f14] to-black border-2 border-zinc-800 hover:border-amber-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Comic Cover Art Preview */}
          <div className="md:col-span-5 flex justify-center">
            <div
              onClick={() => {
                sound.playTap();
                onSelectComic(currentComic);
              }}
              className="group relative w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-zinc-700/80 hover:border-amber-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <img
                src={currentComic.coverImage}
                alt={currentComic.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                <span className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                  <Eye className="w-4 h-4" />
                  <span>START READING</span>
                </span>
              </div>

              {/* Issue Ribbon & Path Badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="px-3 py-1 rounded bg-black/85 backdrop-blur-md text-amber-400 font-mono text-xs font-black uppercase tracking-wider border border-amber-500/30">
                  ISSUE #{currentComic.issueNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-amber-500 text-black font-mono text-[10px] font-black uppercase tracking-wider shadow">
                  GRAPHIC NOVEL
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Comic Information & Actions */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                  {currentComic.series}
                </p>
                <span className="text-zinc-600">•</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                  ISSUE #{currentComic.issueNumber}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {currentComic.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-zinc-300 leading-relaxed font-serif italic">
                “{currentComic.description}”
              </p>
            </div>

            {/* Editorial Note if present */}
            {currentComic.coverNote && (
              <div className="p-3.5 rounded-xl bg-[#141724] border border-amber-500/30 text-xs font-mono text-zinc-300 flex items-start gap-2.5">
                <span className="text-amber-400 text-sm mt-0.5 font-bold">ⓘ</span>
                <div>
                  <span className="font-bold text-amber-300 block mb-0.5 uppercase tracking-wide text-[10px]">
                    EDITORIAL NOTE
                  </span>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">
                    {currentComic.coverNote}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentComic.pageCount} Pages (Flippable)</span>
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{currentComic.readingTimeMinutes} min reading time</span>
              </span>

              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                Stacked Phone Mode + Horizontal Flip
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {currentComic.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Uncle Rwamiti Teaser Quote */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border-l-4 border-amber-400">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1">
                UNCLE RWAMITI'S TAKEAWAY:
              </span>
              <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed">
                “{currentComic.rwamitiWisdom}”
              </p>
            </div>

            {/* Read & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onSelectComic(currentComic);
                }}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xl shadow-amber-500/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>READ FLIPPABLE COMIC</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleWhatsAppShare(currentComic)}
                className="px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                title="Share on WhatsApp with Cover Thumbnail Preview"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>SHARE ON WHATSAPP</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleToggleBookmark(e, currentComic.slug)}
                className="px-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-400 transition cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    <span>SAVED</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>SAVE TO MY LIST</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comic Pages Gallery Preview for Currently Selected Comic */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Pages in Issue #{currentComic.issueNumber}</span>
            <span className="text-xs font-mono text-zinc-500">({currentComic.pageCount} pages)</span>
          </h2>
          <span className="text-xs font-mono text-zinc-400">
            Click any page to begin reading
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {currentComic.pages.map((p, idx) => (
            <div
              key={p.pageNumber}
              onClick={() => {
                sound.playTap();
                onSelectComic(currentComic);
              }}
              className="group bg-[#11131a] border border-zinc-800 hover:border-amber-400 rounded-xl overflow-hidden p-2 transition cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden mb-2">
                <img
                  src={p.image}
                  alt={p.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-amber-400 text-[9px] font-mono font-bold">
                  {idx === 0 ? 'Cover' : `P${idx}`}
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 truncate group-hover:text-amber-400 transition-colors">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* All Issues in Series Shelf Grid */}
      <div className="pt-6 border-t border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>All Issues in the Comics Series</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Choose an issue below to read or view its story details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {comics.map((comic) => {
            const isCurrentlySelected = comic.slug === currentComic.slug;
            const isSaved = savedSlugs.has(comic.slug);

            return (
              <div
                key={comic.slug}
                className={`flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isCurrentlySelected
                    ? 'bg-[#151824] border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'bg-[#11131a] border-zinc-800 hover:border-zinc-700 hover:bg-[#141620]'
                }`}
              >
                {/* Cover Image Container */}
                <div
                  onClick={() => {
                    sound.playTap();
                    onSelectComic(comic);
                  }}
                  className="relative aspect-[3/4] overflow-hidden bg-black cursor-pointer group"
                >
                  <img
                    src={comic.coverImage}
                    alt={comic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-amber-400 font-mono text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                      ISSUE #{comic.issueNumber}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleToggleBookmark(e, comic.slug)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-amber-400 backdrop-blur-sm flex items-center justify-center transition"
                    title={isSaved ? 'Remove from My List' : 'Save to My List'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  {/* Hover Read Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <span className="px-4 py-2 rounded-lg bg-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>READ ISSUE</span>
                    </span>
                  </div>
                </div>

                {/* Content & Metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">
                        ISSUE #{comic.issueNumber}
                      </span>
                      <span>{comic.pageCount} pages</span>
                    </div>

                    <h3
                      onClick={() => {
                        sound.playTap();
                        onSelectComic(comic);
                      }}
                      className="font-black text-base text-white hover:text-amber-400 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {comic.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-serif leading-relaxed">
                      {comic.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        onSelectComic(comic);
                      }}
                      className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>READ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setSelectedSlug(comic.slug);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`px-3 py-2 rounded-lg border text-[11px] font-mono font-bold transition cursor-pointer ${
                        isCurrentlySelected
                          ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                          : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 bg-zinc-900'
                      }`}
                      title="Preview pages and details above"
                    >
                      {isCurrentlySelected ? 'PREVIEWING' : 'DETAILS'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(comic)}
                      className="p-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white transition cursor-pointer"
                      title="Share issue on WhatsApp"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
