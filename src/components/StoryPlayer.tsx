import React, { useState, useEffect } from 'react';
import { Episode, StoryNode, StoryChoice } from '../types';
import { sound } from '../services/audio';
import { AnalyticsService } from '../services/analytics';
import { FirestoreDataService } from '../services/firestoreData';
import { RwamitiPosterArt } from './RwamitiPosterArt';
import { Share2, RotateCcw, ArrowRight, Check, BarChart2, Sparkles, AlertCircle, LayoutGrid, ChevronLeft } from 'lucide-react';

interface StoryPlayerProps {
  episode: Episode;
  onNextEpisode: (nextEpisodeId: string) => void;
  onOpenShare: () => void;
  onOpenSubscription: () => void;
  isPremiumUser: boolean;
  showAggregateStats: boolean;
  onStoryCompleted: (episodeId: string) => void;
  onBackToCatalog?: () => void;
}

type PlayerPhase = 'story_node' | 'rwamiti_twist' | 'epilogue';

export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  episode,
  onNextEpisode,
  onOpenShare,
  onOpenSubscription,
  isPremiumUser,
  showAggregateStats,
  onStoryCompleted,
  onBackToCatalog,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(episode.initialNodeId);
  const [phase, setPhase] = useState<PlayerPhase>('story_node');
  const [userSelectedChoice, setUserSelectedChoice] = useState<StoryChoice | null>(null);
  const [rwamitiAnswer, setRwamitiAnswer] = useState<string | null>(null);
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  // Reset state when episode changes
  useEffect(() => {
    setCurrentNodeId(episode.initialNodeId);
    setPhase('story_node');
    setUserSelectedChoice(null);
    setRwamitiAnswer(null);
    setPathHistory([episode.initialNodeId]);

    AnalyticsService.track('episode_opened', { episodeId: episode.id });
  }, [episode.id, episode.initialNodeId]);

  // Check if locked
  const epNum = parseInt(episode.number, 10);
  const isEpPremium = !isNaN(epNum) ? epNum >= 6 : !!episode.isPremium;
  if (isEpPremium && !isPremiumUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-100 min-h-[500px]">
        <div className="w-14 h-14 rounded-full bg-[#e5a93b]/20 border border-[#e5a93b]/50 text-[#e5a93b] flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#e5a93b] mb-1">
          YOUR MOVE+ EXCLUSIVE
        </span>
        <h2 className="text-2xl font-black text-white mb-2">
          Episode {episode.number}: {episode.title}
        </h2>
        <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
          {episode.teaser}
        </p>
        <button
          onClick={() => {
            sound.playTap();
            onOpenSubscription();
          }}
          className="w-full max-w-xs py-3.5 px-6 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-extrabold text-sm tracking-wide shadow-lg shadow-[#e5a93b]/20 cursor-pointer transition-all"
        >
          UNLOCK WITH YOUR MOVE+ →
        </button>
      </div>
    );
  }

  const currentNode: StoryNode | undefined = episode.nodes[currentNodeId] || episode.nodes[episode.initialNodeId];

  // Play audio ping if node has chat messages
  useEffect(() => {
    if (currentNode && currentNode.chatMessages && currentNode.chatMessages.length > 0) {
      sound.playPing();
    }
  }, [currentNodeId]);

  // Handle continuing linear step
  const handleLinearContinue = (targetNodeId?: string) => {
    sound.playTap();

    if (currentNode.type === 'start') {
      AnalyticsService.track('story_started', { episodeId: episode.id, nodeId: currentNode.id });
    }

    if (currentNode.type === 'climax') {
      // Transition to Uncle Rwamiti twist screen!
      AnalyticsService.track('climax_reached', { episodeId: episode.id });
      sound.playDramaticTwist();
      setPhase('rwamiti_twist');
      return;
    }

    const nextId = targetNodeId || currentNode.nextNodeId;
    if (nextId && episode.nodes[nextId]) {
      setCurrentNodeId(nextId);
      setPathHistory((prev) => [...prev, nextId]);
    } else {
      // If no next node, proceed to twist
      sound.playDramaticTwist();
      setPhase('rwamiti_twist');
    }
  };

  // Handle player choice
  const handleSelectChoice = (choice: StoryChoice) => {
    sound.playTap();
    setUserSelectedChoice(choice);
    AnalyticsService.track('choice_selected', {
      episodeId: episode.id,
      nodeId: currentNode.id,
      choiceId: choice.id,
      choiceLabel: choice.label,
    });
    FirestoreDataService.recordChoiceStat(episode.id, currentNode.id, choice.id);

    if (choice.nextNodeId && episode.nodes[choice.nextNodeId]) {
      setCurrentNodeId(choice.nextNodeId);
      setPathHistory((prev) => [...prev, choice.nextNodeId]);
    } else {
      sound.playDramaticTwist();
      setPhase('rwamiti_twist');
    }
  };

  // Handle Uncle Rwamiti answer
  const handleRwamitiAnswer = (option: string, index?: number) => {
    sound.playTap();
    setRwamitiAnswer(option);
    AnalyticsService.track('rwamiti_answered', {
      episodeId: episode.id,
      metadata: { answer: option },
    });
    if (typeof index === 'number') {
      FirestoreDataService.recordPollVote(episode.id, index);
    }

    setTimeout(() => {
      setPhase('epilogue');
      AnalyticsService.track('story_completed', { episodeId: episode.id });
      onStoryCompleted(episode.id);
    }, 400);
  };

  // Handle Replay / Try Another Path
  const handleReplay = () => {
    sound.playTap();
    AnalyticsService.track('replay_clicked', { episodeId: episode.id });
    setCurrentNodeId(episode.initialNodeId);
    setPhase('story_node');
    setUserSelectedChoice(null);
    setRwamitiAnswer(null);
    setPathHistory([episode.initialNodeId]);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto w-full min-h-[calc(100vh-60px)] select-none">
      {/* Top Bar with All Stories navigation */}
      {onBackToCatalog && (
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800/80">
          <button
            onClick={() => {
              sound.playTap();
              onBackToCatalog();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-[#e5a93b] transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>ALL STORIES</span>
          </button>

          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            EPISODE {episode.number}
          </span>
        </div>
      )}

      {/* PHASE 1: STORY NODE (Start, Decision, Consequence, Climax) */}
      {phase === 'story_node' && currentNode && (
        <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-200">
          {/* Top narrative content */}
          <div className="space-y-4 pt-1">
            {/* Tag / Badge */}
            {(currentNode.badge || episode.badge) && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-widest ${
                    currentNode.badgeColor === 'red'
                      ? 'text-red-500'
                      : currentNode.badgeColor === 'emerald'
                      ? 'text-emerald-400'
                      : 'text-[#e5a93b]'
                  }`}
                >
                  {currentNode.badge || episode.badge}
                </span>
              </div>
            )}

            {/* Sleek Episode Start Header */}
            {currentNode.type === 'start' && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#20150d] to-[#120f0c] border border-[#e5a93b]/40">
                <RwamitiPosterArt variant="avatar" className="w-12 h-12" allowUpload={false} />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-[#e5a93b] uppercase tracking-wider">
                    EPISODE {episode.number} • YOUR MOVE
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {episode.title}
                  </div>
                </div>
              </div>
            )}

            {/* Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                {currentNode.headline}
              </h1>
              {currentNode.leadText && (
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  {currentNode.leadText}
                </div>
              )}
            </div>

            {/* Narrative Body Paragraphs */}
            {currentNode.bodyParagraphs && currentNode.bodyParagraphs.length > 0 && (
              <div className="space-y-2.5 text-zinc-200 text-sm sm:text-base font-normal leading-relaxed pt-1">
                {currentNode.bodyParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {/* Chat / PING notifications */}
            {currentNode.chatMessages && currentNode.chatMessages.length > 0 && (
              <div className="space-y-2.5 pt-2">
                {currentNode.chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs sm:text-sm font-medium ${
                      msg.type === 'alert'
                        ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                        : 'bg-zinc-900/90 border-zinc-700/80 text-zinc-100 shadow-sm'
                    }`}
                  >
                    <span className="font-extrabold text-[#e5a93b] uppercase tracking-wide mr-2 text-[11px]">
                      {msg.sender}:
                    </span>
                    <span className="leading-snug">{msg.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Highlight line (e.g. Battery: 1% or Alert) */}
            {currentNode.highlightText && (
              <div className="pt-2">
                <div className="text-red-500 font-extrabold text-base sm:text-lg tracking-wide animate-pulse">
                  {currentNode.highlightText}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions: Choices or Continue */}
          <div className="pt-6 pb-2 space-y-3">
            {/* If Decision Node: Stacked Choice Buttons */}
            {currentNode.type === 'decision' && currentNode.choices && (
              <div className="space-y-2.5">
                {currentNode.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] active:scale-[0.99] text-black font-extrabold text-xs sm:text-sm tracking-wide text-center uppercase transition-all shadow-md cursor-pointer block"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            )}

            {/* If Start, Consequence, or Climax: Single Big Action Button */}
            {currentNode.type !== 'decision' && (
              <button
                onClick={() => handleLinearContinue()}
                className="w-full py-4 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] active:scale-[0.99] text-black font-extrabold text-xs sm:text-sm tracking-widest text-center uppercase transition-all shadow-lg shadow-[#e5a93b]/15 cursor-pointer"
              >
                {currentNode.buttonText || 'CONTINUE'}
              </button>
            )}

            {/* Footer Tagline */}
            <div className="text-center text-[10px] sm:text-[11px] text-zinc-500 tracking-wider pt-2">
              Episode {episode.number} • Tap a choice • No answer is labelled 'correct'
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: UNCLE RWAMITI TWIST SCREEN */}
      {phase === 'rwamiti_twist' && (
        <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300">
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <RwamitiPosterArt variant="avatar" className="w-14 h-14" />
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#e5a93b] block">
                  UNCLE RWAMITI
                </span>
                <span className="text-[11px] text-zinc-400 italic">
                  He listens carefully. Then he looks at you.
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              {episode.rwamitiEnding.headline}
            </h1>

            <div className="space-y-3 text-zinc-200 text-sm sm:text-base leading-relaxed pt-2">
              {episode.rwamitiEnding.quoteLines.map((line, idx) => (
                <p key={idx} className={line.startsWith('“') ? 'text-[#e5a93b] font-bold' : ''}>
                  {line}
                </p>
              ))}
            </div>

            <div className="pt-4 text-zinc-300 text-xs sm:text-sm font-semibold italic">
              Then he asks:
            </div>
            <div className="text-white text-base sm:text-lg font-extrabold leading-snug">
              {episode.rwamitiEnding.closingQuestion}
            </div>
          </div>

          {/* Uncle Rwamiti Poll Options */}
          <div className="pt-6 pb-2 space-y-2.5">
            {episode.rwamitiEnding.pollOptions.map((opt, idx) => (
              <button
                key={opt}
                onClick={() => handleRwamitiAnswer(opt, idx)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] active:scale-[0.99] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                {opt}
              </button>
            ))}

            <div className="text-center text-[10px] text-zinc-500 tracking-wider pt-2">
              Tap an answer • Uncle Rwamiti listens
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: EPILOGUE & CONTINUATION */}
      {phase === 'epilogue' && (
        <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300">
          <div className="space-y-5 pt-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#e5a93b]">
              EPILOGUE
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              WHAT WOULD YOU DO?
            </h1>

            <div className="space-y-1.5 text-zinc-300 text-sm sm:text-base leading-relaxed">
              <p className="font-extrabold text-white">No score. No sermon. No gold star.</p>
              <p>Just another chance to make the decision.</p>
            </div>

            <div className="pt-2 text-[#e5a93b] font-black text-base sm:text-lg tracking-wide uppercase">
              WOULD YOU CHOOSE DIFFERENTLY?
            </div>

            {/* Aggregate Choice Results (Section 12 requirement) */}
            {showAggregateStats && (
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-1">
                  <div className="flex items-center gap-1.5 text-[#e5a93b]">
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>HOW PEERS CHOSE IN UGANDA</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Aggregated</span>
                </div>

                {/* Show choices and their stats */}
                {episode.nodes['node-decision-1']?.choices?.map((c) => (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-zinc-200">
                      <span className="truncate pr-2">{c.label}</span>
                      <span className="font-bold text-[#e5a93b]">{c.statPercent || 25}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#e5a93b] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${c.statPercent || 25}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Continuation & Share Action Buttons */}
          <div className="pt-6 pb-2 space-y-2.5">
            {/* TRY ANOTHER PATH */}
            <button
              onClick={handleReplay}
              className="w-full py-3.5 px-4 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] active:scale-[0.99] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>TRY ANOTHER PATH</span>
            </button>

            {/* NEXT EPISODE */}
            {episode.recommendedNextEpisodeId && (
              <button
                onClick={() => onNextEpisode(episode.recommendedNextEpisodeId!)}
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all border border-zinc-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>YOUR NEXT MOVE →</span>
                <ArrowRight className="w-4 h-4 text-[#e5a93b]" />
              </button>
            )}

            {/* CHALLENGE THEM */}
            <button
              onClick={onOpenShare}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>CHALLENGE A FRIEND ON WHATSAPP</span>
            </button>

            {/* CHOOSE ANOTHER STORY */}
            {onBackToCatalog && (
              <button
                onClick={() => {
                  sound.playTap();
                  onBackToCatalog();
                }}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all border border-zinc-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 text-[#e5a93b]" />
                <span>CHOOSE ANOTHER STORY</span>
              </button>
            )}

            <div className="text-center text-[10px] text-zinc-500 tracking-wider pt-1">
              PLAY → FINISH → REPLAY → PLAY NEXT → RETURN
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
