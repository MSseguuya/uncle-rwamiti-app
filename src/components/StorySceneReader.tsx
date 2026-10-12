import React, { useState, useEffect, useMemo } from 'react';
import { CatalogStory, StoryData, StoryDatabaseService, StoryProgress } from '../services/storyDatabaseService';
import { ReaderControls } from './ReaderControls';
import { AuthorFooter } from './AuthorFooter';
import { sound } from '../services/audio';
import { AnalyticsService } from '../services/analytics';

// Traverses downstream from a node to collect total decision depths to all terminal endpoints
function getDownstreamChoiceDepths(
  nodesMap: Record<string, any>,
  startKey: string,
  visited = new Set<string>()
): number[] {
  if (visited.has(startKey)) return [0];
  const node = nodesMap[startKey];
  if (!node || node.is_ending || !node.choices || node.choices.length === 0) return [0];

  visited.add(startKey);
  const isDecision = node.choices.length > 1;
  const decisionWeight = isDecision ? 1 : 0;

  const depths: number[] = [];
  for (const c of node.choices) {
    const targetKey = c.to || c.target;
    if (!targetKey) {
      depths.push(decisionWeight);
      continue;
    }
    const childDepths = getDownstreamChoiceDepths(nodesMap, targetKey, new Set(visited));
    for (const cd of childDepths) {
      depths.push(decisionWeight + cd);
    }
  }
  return depths.length > 0 ? depths : [decisionWeight];
}

interface StorySceneReaderProps {
  storyMeta: CatalogStory;
  storyData: StoryData;
  onBackToStories: () => void;
  onShare: (story: CatalogStory) => void;
}

export const StorySceneReader: React.FC<StorySceneReaderProps> = ({
  storyMeta,
  storyData,
  onBackToStories,
  onShare,
}) => {
  const [currentNodeKey, setCurrentNodeKey] = useState<string>('opening');
  const [trail, setTrail] = useState<Array<{ from: string; to: string; label: string }>>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [seenEndings, setSeenEndings] = useState<string[]>([]);
  const [previousTrail, setPreviousTrail] = useState<Array<{ from: string; to: string; label: string }> | null>(null);

  // Active playing time tracking (accumulates actively while tab is focused)
  const activeStartRef = React.useRef<number>(Date.now());
  const activeAccumulatorRef = React.useRef<number>(0);

  const getActiveSeconds = () => {
    const currentRun = Math.round((Date.now() - activeStartRef.current) / 1000);
    return activeAccumulatorRef.current + Math.max(0, currentRun);
  };

  useEffect(() => {
    activeStartRef.current = Date.now();
    activeAccumulatorRef.current = 0;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        activeStartRef.current = Date.now();
      } else {
        const elapsed = Math.round((Date.now() - activeStartRef.current) / 1000);
        activeAccumulatorRef.current += Math.max(0, elapsed);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [storyMeta.slug]);

  // Load existing progress or initialize
  useEffect(() => {
    const saved = StoryDatabaseService.getProgress(storyMeta.slug);
    if (saved && storyData.nodes[saved.node]) {
      setCurrentNodeKey(saved.node);
      setTrail(saved.trail || []);
      setHistory(saved.history || []);
      setSeenEndings(saved.seenEndings || []);
      if (saved.previous) {
        setPreviousTrail(saved.previous.trail);
      }
    } else {
      AnalyticsService.recordStoryStarted(storyMeta.slug, storyMeta.title, false);
    }
  }, [storyMeta.slug, storyData]);

  const nodes = storyData.nodes || {};
  const currentNode = nodes[currentNodeKey] || nodes['opening'] || {
    key: 'opening',
    title: storyMeta.title,
    summary: storyMeta.description,
    paragraphs: [storyMeta.description],
    choices: [],
    is_ending: false,
  };

  const isEnding = !!currentNode.is_ending;

  // Calculate move progress and label reflecting the actual route or "Your next move"
  const { moveLabel, progressPercent } = useMemo(() => {
    if (isEnding) {
      return { moveLabel: 'Story complete', progressPercent: 100 };
    }

    const initialKey = nodes['opening'] ? 'opening' : Object.keys(nodes)[0] || 'start';
    const initialDepths = getDownstreamChoiceDepths(nodes, initialKey);
    const initialMin = initialDepths.length > 0 ? Math.min(...initialDepths) : 0;
    const initialMax = initialDepths.length > 0 ? Math.max(...initialDepths) : 0;
    const hasFixedTotal = initialMin === initialMax && initialMin > 0;

    const choicesDone = trail.filter((m) => {
      const n = nodes[m.from];
      return n && !n.is_ending && n.choices && n.choices.length > 1;
    }).length;

    const isCurrentDecision = currentNode.choices && currentNode.choices.length > 1;

    if (hasFixedTotal) {
      const totalMoves = initialMin;
      const currentMove = Math.min(totalMoves, choicesDone + (isCurrentDecision ? 1 : 0));
      const percent = Math.min(95, Math.max(15, Math.round(((choicesDone + 1) / (totalMoves + 0.3)) * 100)));
      return {
        moveLabel: isCurrentDecision ? `Move ${currentMove} of ${totalMoves}` : 'Your next move',
        progressPercent: percent,
      };
    }

    // Branching prevents a reliable total across the story: use wording such as "Your next move"
    const currentDepths = getDownstreamChoiceDepths(nodes, currentNodeKey);
    const currentMin = currentDepths.length > 0 ? Math.min(...currentDepths) : 1;
    const currentMax = currentDepths.length > 0 ? Math.max(...currentDepths) : 2;
    const approxRemaining = Math.max(1, Math.round((currentMin + currentMax) / 2));
    const approxTotal = choicesDone + approxRemaining;
    const percent = Math.min(90, Math.max(20, Math.round(((choicesDone + 1) / (approxTotal + 0.5)) * 100)));

    return {
      moveLabel: 'Your next move',
      progressPercent: percent,
    };
  }, [nodes, currentNodeKey, trail, isEnding]);

  const handleChoice = (targetKey: string, choiceLabel: string) => {
    sound.playTap();
    const activeSec = getActiveSeconds();
    AnalyticsService.recordChoiceSelected({
      episodeId: storyMeta.slug,
      episodeTitle: storyMeta.title,
      nodeId: currentNodeKey,
      choiceLabel,
      choiceId: targetKey,
      totalChoicesMade: trail.length + 1,
      activeTimeSeconds: activeSec,
    });

    const newTrail = [...trail, { from: currentNodeKey, to: targetKey, label: choiceLabel }];
    const newHistory = [...history, currentNodeKey];
    const targetNode = nodes[targetKey];
    const targetIsEnding = !!targetNode?.is_ending;

    const newSeenEndings = targetIsEnding
      ? Array.from(new Set([...seenEndings, targetKey]))
      : seenEndings;

    setTrail(newTrail);
    setHistory(newHistory);
    setCurrentNodeKey(targetKey);
    setSeenEndings(newSeenEndings);

    // Save progress
    const updatedProgress: StoryProgress = {
      id: storyMeta.slug,
      node: targetKey,
      history: newHistory,
      trail: newTrail,
      completed: targetIsEnding,
      seenEndings: newSeenEndings,
      previous: previousTrail ? { trail: previousTrail, ending: '' } : null,
    };
    StoryDatabaseService.saveProgress(updatedProgress);

    if (targetIsEnding) {
      AnalyticsService.recordStoryCompleted({
        episodeId: storyMeta.slug,
        episodeTitle: storyMeta.title,
        endingNodeId: targetKey,
        endingTitle: targetNode?.title || 'Story Complete',
        finalChoiceLabel: choiceLabel,
        choicesCount: trail.length + 1,
        activeTimeSeconds: activeSec,
      });
    }

    // Scroll to top of reading pane smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplay = () => {
    sound.playTap();
    activeStartRef.current = Date.now();
    activeAccumulatorRef.current = 0;
    AnalyticsService.recordReplayClicked(storyMeta.slug);
    // Deliberate replay starts a separate identifiable attempt
    AnalyticsService.recordStoryStarted(storyMeta.slug, storyMeta.title, true);

    setPreviousTrail(trail);
    setTrail([]);
    setHistory([]);
    setCurrentNodeKey('opening');

    const updatedProgress: StoryProgress = {
      id: storyMeta.slug,
      node: 'opening',
      history: [],
      trail: [],
      completed: false,
      seenEndings,
      previous: {
        trail,
        ending: currentNodeKey,
      },
    };
    StoryDatabaseService.saveProgress(updatedProgress);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wisdom = StoryDatabaseService.getUncleWisdom(storyMeta.slug);
  const sceneImage = currentNode.image || storyMeta.cover || 'cover-match-you-missed.webp';

  // Total possible endings count
  const allEndings = Object.values(nodes).filter((n) => (n as any)?.is_ending);
  const totalEndingsCount = Math.max(2, allEndings.length);
  const witnessedCount = Math.max(1, seenEndings.length);

  return (
    <main className="shell anthology-scene min-h-screen">
      {/* Left visual pane (desktop sticky) */}
      <div className="visual">
        <img
          decoding="async"
          src={sceneImage}
          alt={storyMeta.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'drawer.webp';
          }}
        />
        <div className="visual-caption">AN UNCLE RWAMITI STORY</div>
        <div className="visual-brand">
          <img decoding="async" src="rwamiti.jpg" alt="Uncle Rwamiti portrait" />
          <span>
            UNCLE RWAMITI
            <br />
            <small>KAMPALA, UGANDA</small>
          </span>
        </div>
      </div>

      {/* Right reading pane */}
      <section className="pane">
        <header className="topbar">
          <div className="header-left flex items-center gap-3">
            <button
              type="button"
              className="backbutton"
              onClick={() => {
                sound.playTap();
                onBackToStories();
              }}
              aria-label="Back to stories"
            >
              ←
            </button>
            <span className="wordmark flex items-center gap-2">
              <img
                decoding="async"
                src="rwamiti.jpg"
                alt="Uncle Rwamiti"
                className="brand-avatar"
              />
              <span>
                YOUR <b>MOVE</b>
              </span>
            </span>
          </div>

          <div className="top-actions flex items-center gap-2">
            <ReaderControls />
            <button
              type="button"
              className="iconbutton"
              onClick={() => {
                sound.playTap();
                onShare(storyMeta);
              }}
              aria-label="Share story"
              title="Share story"
            >
              ↗
            </button>
          </div>
        </header>

        {/* Progress bar */}
        <div
          className="progress"
          role="progressbar"
          aria-label="Story progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
        >
          <span style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Reading content */}
        <div className="reading">
          {/* Mobile scene photo */}
          <div className="scene-photo-mobile">
            <img
              decoding="async"
              src={sceneImage}
              alt={currentNode.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'drawer.webp';
              }}
            />
          </div>

          <p className="kicker">
            {storyMeta.title.toUpperCase()} / {isEnding ? 'STORY COMPLETE' : currentNode.title.toUpperCase()}
          </p>

          <h1 className="scene-title">
            {currentNodeKey === 'opening' ? storyMeta.title : currentNode.title}
          </h1>

          <p className="move-status">{moveLabel}</p>

          {/* Replay echo reminder if replaying */}
          {previousTrail && previousTrail.length > 0 && currentNodeKey === 'opening' && (
            <p className="memory-echo">
              Last time your first move was: “{previousTrail[0].label}”. You can explore a different response.
            </p>
          )}

          {/* Story paragraphs */}
          <div className="story space-y-5 my-6 leading-relaxed">
            {currentNode.paragraphs.map((p, idx) => (
              <p key={idx} className="text-base sm:text-lg leading-relaxed text-[var(--text,#f5f3ed)]">
                {p}
              </p>
            ))}
          </div>

          {/* Reading Footer: Choices or Ending */}
          <div className="reading-footer pt-6">
            {!isEnding && currentNode.choices && currentNode.choices.length > 0 ? (
              <div className="choices space-y-3" aria-label="Your choices">
                <div className="choice-heading font-mono text-xs font-bold tracking-widest text-[var(--yellow,#f4c900)] mb-3">
                  YOUR MOVE
                </div>
                {currentNode.choices.map((choice, i) => (
                  <button
                    key={i}
                    type="button"
                    className="choice"
                    onClick={() => handleChoice(choice.to, choice.label)}
                  >
                    <span className="choice-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="choice-text text-left flex-1 font-semibold">{choice.label}</span>
                    <span className="choice-arrow font-mono" aria-hidden="true">
                      ↗
                    </span>
                  </button>
                ))}
              </div>
            ) : !isEnding && currentNode.next ? (
              <button
                type="button"
                className="continuation primary w-full py-4 text-center font-bold text-lg"
                onClick={() => handleChoice(currentNode.next!, 'Continue')}
              >
                Continue →
              </button>
            ) : (
              <div className="anthology-end">
                <span className="end-mark" role="status">
                  STORY COMPLETE · THE END
                </span>

                {/* Your Moves */}
                {trail.length > 0 && (
                  <div className="move-receipt my-6">
                    <span className="block font-mono text-xs font-bold text-[var(--yellow,#f4c900)] tracking-wider mb-2">
                      YOUR MOVES
                    </span>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-[var(--text,#f5f3ed)]">
                      {trail.map((move, i) => (
                        <li key={i}>
                          <span className="font-semibold">{move.label}</span>
                        </li>
                      ))}
                    </ol>

                    {currentNode.paragraphs.length > 0 && (
                      <details className="receipt-aftermath mt-4 pt-3 border-t border-[var(--line,rgba(255,255,255,0.1))]">
                        <summary className="cursor-pointer text-xs font-mono text-[var(--yellow,#f4c900)] hover:underline">
                          What followed your moves
                        </summary>
                        <div className="mt-3 space-y-2 text-sm text-[var(--muted,#b8b8b5)]">
                          {currentNode.paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                )}

                {/* Outcome memory count */}
                <p className="outcome-memory text-sm font-mono text-[var(--muted,#b8b8b5)] my-4">
                  {witnessedCount} of {totalEndingsCount} outcomes witnessed. Other endings remain hidden.
                </p>

                {/* Uncle Rwamiti Conclusion */}
                {wisdom && (
                  <aside className="uncle-conclusion my-6 flex items-start gap-4 p-4 rounded bg-[var(--surface,#1a1a1a)] border border-[var(--line,rgba(255,255,255,0.1))]">
                    <img
                      decoding="async"
                      src="rwamiti.jpg"
                      alt="Portrait of Uncle Rwamiti"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[var(--yellow,#f4c900)] flex-shrink-0"
                    />
                    <div>
                      <span className="block font-mono text-xs font-bold text-[var(--yellow,#f4c900)] tracking-wider">
                        UNCLE RWAMITI
                      </span>
                      <p className="text-sm italic text-[var(--text,#f5f3ed)] mt-1 leading-relaxed">
                        “{wisdom}”
                      </p>
                    </div>
                  </aside>
                )}

                <button
                  type="button"
                  className="primary w-full py-4 font-bold text-base my-2"
                  onClick={handleReplay}
                >
                  Try another choice
                </button>

                <button
                  type="button"
                  className="secondary w-full py-3 font-semibold text-sm my-1"
                  onClick={() => {
                    sound.playTap();
                    onBackToStories();
                  }}
                >
                  Play another story
                </button>

                <button
                  type="button"
                  className="secondary share-ending w-full py-3 font-semibold text-sm my-1"
                  onClick={() => {
                    sound.playTap();
                    onShare(storyMeta);
                  }}
                >
                  Share this dilemma
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subtle line down the page: author..contact..publisher */}
      <AuthorFooter
        onOpenAdmin={() => window.dispatchEvent(new CustomEvent('open-admin-cms'))}
      />
    </main>
  );
};
