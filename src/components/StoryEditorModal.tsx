import React, { useState, useEffect } from 'react';
import { Episode, StoryNode, StoryChoice } from '../types';
import { sound } from '../services/audio';
import {
  X,
  Save,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Layers,
  HelpCircle,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  Sliders,
} from 'lucide-react';

interface StoryEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null; // null if creating a new story
  existingEpisodes: Episode[];
  onSave: (savedEpisode: Episode) => void;
}

const PRESET_COVERS = [
  { label: 'Uncle Rwamiti Signature', url: 'rwamiti.jpg' },
  { label: 'Kampala Dilemma Art', url: 'rwamiti_dilemma.png' },
  { label: 'Golden Spotlight', url: 'rwamiti.jpg' },
];

const CATEGORIES = ['Kampala Dilemmas', 'Teen Stories', 'Adult Stories', 'Relationships & Trust', 'Money & Blackmail'];

const BADGE_COLORS: Array<'amber' | 'red' | 'emerald' | 'zinc'> = [
  'amber',
  'red',
  'emerald',
  'zinc',
];

export const StoryEditorModal: React.FC<StoryEditorModalProps> = ({
  isOpen,
  onClose,
  episode,
  existingEpisodes,
  onSave,
}) => {
  const isEditing = Boolean(episode);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [teaser, setTeaser] = useState('');
  const [category, setCategory] = useState('Kampala Dilemmas');
  const [customCategory, setCustomCategory] = useState('');
  const [badge, setBadge] = useState('KAMPALA • DILEMMA');
  const [badgeColor, setBadgeColor] = useState<'amber' | 'red' | 'emerald' | 'zinc'>('amber');
  const [coverImage, setCoverImage] = useState('rwamiti.jpg');
  const [isPremium, setIsPremium] = useState(false);
  const [published, setPublished] = useState(true);
  const [number, setNumber] = useState('');

  // Narrative Flow State
  const [startHeadline, setStartHeadline] = useState('');
  const [startParagraphs, setStartParagraphs] = useState('');
  const [startButtonText, setButtonText] = useState('START');

  // Decision 1 State
  const [decisionHeadline, setDecisionHeadline] = useState('WHAT IS YOUR MOVE?');
  const [choiceA, setChoiceA] = useState({
    label: 'A. CONFRONT THE SITUATION DIRECTLY',
    headline: 'THE DIRECT CONFRONTATION',
    body: 'You step forward into the light. The room falls dead silent as all eyes turn toward you.',
  });
  const [choiceB, setChoiceB] = useState({
    label: 'B. KEEP QUIET AND OBSERVE FROM A DISTANCE',
    headline: 'WATCHING FROM THE SHADOWS',
    body: 'You take a step back and slip into the crowd. You notice details others completely missed.',
  });
  const [choiceC, setChoiceC] = useState({
    label: '',
    headline: '',
    body: '',
  });
  const [includeChoiceC, setIncludeChoiceC] = useState(false);

  // Uncle Rwamiti Ending & Reflection
  const [endingHeadline, setEndingHeadline] = useState('“INTERESTING.”');
  const [endingQuote1, setEndingQuote1] = useState('“Every choice in Kampala comes with a price tag attached.”');
  const [endingQuote2, setEndingQuote2] = useState('“The question isn’t whether you paid, but whether you learned.”');
  const [closingQuestion, setClosingQuestion] = useState('“When secrets catch fire, who buys the extinguisher?”');
  const [pollOptions, setPollOptions] = useState(['ME', 'MY PARTNER', 'NOBODY']);

  const [activeTab, setActiveTab] = useState<'basics' | 'story' | 'ending' | 'preview'>('basics');
  const [validationError, setValidationError] = useState('');

  // Populate data on open / episode change
  useEffect(() => {
    if (!isOpen) return;

    if (episode) {
      // Editing existing episode
      setTitle(episode.title || '');
      setSubtitle(episode.subtitle || '');
      setTeaser(episode.teaser || '');
      setCategory(CATEGORIES.includes(episode.category) ? episode.category : 'custom');
      if (!CATEGORIES.includes(episode.category)) {
        setCustomCategory(episode.category);
      }
      setBadge(episode.badge || 'KAMPALA • DILEMMA');
      setBadgeColor(episode.badgeColor || 'amber');
      setCoverImage((episode as any).coverImage || 'rwamiti.jpg');
      setIsPremium(Boolean(episode.isPremium));
      setPublished(episode.published !== false);
      setNumber(episode.number || '');

      // Load initial start node if available
      const startNode = episode.nodes?.[episode.initialNodeId];
      if (startNode) {
        setStartHeadline(startNode.headline || '');
        setStartParagraphs((startNode.bodyParagraphs || []).join('\n\n'));
        setButtonText(startNode.buttonText || 'START');
      }

      // Load decision node
      const decNodeKey = Object.keys(episode.nodes || {}).find(
        (k) => episode.nodes[k]?.type === 'decision' || episode.nodes[k]?.choices?.length
      );
      if (decNodeKey && episode.nodes[decNodeKey]) {
        const decNode = episode.nodes[decNodeKey];
        setDecisionHeadline(decNode.headline || 'WHAT IS YOUR MOVE?');
        const choices = decNode.choices || [];
        if (choices[0]) {
          const nextNode = choices[0].nextNodeId ? episode.nodes[choices[0].nextNodeId] : null;
          setChoiceA({
            label: choices[0].label,
            headline: nextNode?.headline || 'CONSEQUENCE A',
            body: (nextNode?.bodyParagraphs || []).join('\n\n') || '',
          });
        }
        if (choices[1]) {
          const nextNode = choices[1].nextNodeId ? episode.nodes[choices[1].nextNodeId] : null;
          setChoiceB({
            label: choices[1].label,
            headline: nextNode?.headline || 'CONSEQUENCE B',
            body: (nextNode?.bodyParagraphs || []).join('\n\n') || '',
          });
        }
        if (choices[2]) {
          const nextNode = choices[2].nextNodeId ? episode.nodes[choices[2].nextNodeId] : null;
          setIncludeChoiceC(true);
          setChoiceC({
            label: choices[2].label,
            headline: nextNode?.headline || 'CONSEQUENCE C',
            body: (nextNode?.bodyParagraphs || []).join('\n\n') || '',
          });
        } else {
          setIncludeChoiceC(false);
        }
      }

      // Load Rwamiti ending
      if (episode.rwamitiEnding) {
        setEndingHeadline(episode.rwamitiEnding.headline || '“INTERESTING.”');
        setEndingQuote1(episode.rwamitiEnding.quoteLines?.[0] || '');
        setEndingQuote2(episode.rwamitiEnding.quoteLines?.[1] || '');
        setClosingQuestion(episode.rwamitiEnding.closingQuestion || '');
        if (episode.rwamitiEnding.pollOptions?.length) {
          setPollOptions(episode.rwamitiEnding.pollOptions);
        }
      }
    } else {
      // Creating new episode
      // Compute next episode number
      const maxNum = existingEpisodes.reduce((max, ep) => {
        const n = parseInt(ep.number, 10);
        return !isNaN(n) && n > max ? n : max;
      }, 0);
      const nextNum = (maxNum + 1).toString().padStart(3, '0');

      setTitle('');
      setSubtitle('');
      setTeaser('');
      setCategory('Kampala Dilemmas');
      setCustomCategory('');
      setBadge('KAMPALA • DILEMMA');
      setBadgeColor('amber');
      setCoverImage('rwamiti.jpg');
      setIsPremium(false);
      setPublished(true);
      setNumber(nextNum);

      setStartHeadline('THE ENCOUNTER.');
      setStartParagraphs(
        '11:45 PM.\n\nThe rain beats hard against the tin roof in Kololo.\nA sudden knock on the back door rattles your kitchen cup rack.\nNobody was expected this late.'
      );
      setButtonText('START');

      setDecisionHeadline('WHAT IS YOUR MOVE?');
      setChoiceA({
        label: 'A. UNLOCK THE DOOR WITH A HEAVY TORCH IN HAND',
        headline: 'FACE TO FACE.',
        body: 'The bolt slides back. You pull open the door to reveal a soaking-wet figure catching their breath.',
      });
      setChoiceB({
        label: 'B. CALL YOUR SECURITY BODA GROUP FIRST',
        headline: 'BACKUP EN ROUTE.',
        body: 'Your phone vibrates as the voice on the other end confirms two bodas are speeding toward your gate.',
      });
      setChoiceC({ label: '', headline: '', body: '' });
      setIncludeChoiceC(false);

      setEndingHeadline('“INTERESTING.”');
      setEndingQuote1('“Fear makes you fast, but wisdom tells you where to run.”');
      setEndingQuote2('“In Kampala, the night always asks who holds the keys.”');
      setClosingQuestion('“When the door knocks at midnight, do you look or do you listen?”');
      setPollOptions(['I LOOK', 'I LISTEN', 'I NEVER ANSWER']);
    }

    setValidationError('');
    setActiveTab('basics');
  }, [isOpen, episode, existingEpisodes]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim()) {
      setValidationError('Story title is required.');
      setActiveTab('basics');
      return;
    }

    if (!startHeadline.trim() || !startParagraphs.trim()) {
      setValidationError('Opening scene headline and narrative text are required.');
      setActiveTab('story');
      return;
    }

    if (!choiceA.label.trim() || !choiceB.label.trim()) {
      setValidationError('Please provide at least two choices (Choice A and Choice B).');
      setActiveTab('story');
      return;
    }

    const resolvedCategory = category === 'custom' ? customCategory.trim() || 'Kampala Dilemmas' : category;

    // Generate slug / ID
    let finalId = episode?.id;
    if (!finalId) {
      const slugCandidate = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      finalId = `ep-${number || '000'}-${slugCandidate}`;
    }

    const startNodeId = `node-start-${finalId}`;
    const decNodeId = `node-dec-${finalId}`;
    const conANodeId = `node-con-a-${finalId}`;
    const conBNodeId = `node-con-b-${finalId}`;
    const conCNodeId = `node-con-c-${finalId}`;
    const climaxNodeId = `node-climax-${finalId}`;

    const choicesArray: StoryChoice[] = [
      {
        id: `c_${finalId}_1`,
        label: choiceA.label.trim(),
        nextNodeId: conANodeId,
        statPercent: 52,
        statCount: 26,
      },
      {
        id: `c_${finalId}_2`,
        label: choiceB.label.trim(),
        nextNodeId: conBNodeId,
        statPercent: 48,
        statCount: 24,
      },
    ];

    if (includeChoiceC && choiceC.label.trim()) {
      choicesArray.push({
        id: `c_${finalId}_3`,
        label: choiceC.label.trim(),
        nextNodeId: conCNodeId,
        statPercent: 25,
        statCount: 12,
      });
    }

    // Build complete branching nodes map
    const nodes: Record<string, StoryNode> = {
      [startNodeId]: {
        id: startNodeId,
        type: 'start',
        badge: badge.trim() || 'KAMPALA • DILEMMA',
        badgeColor,
        headline: startHeadline.trim(),
        leadText: `EPISODE ${number || '000'}`,
        bodyParagraphs: startParagraphs
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean),
        buttonText: startButtonText.trim() || 'START',
        nextNodeId: decNodeId,
      },
      [decNodeId]: {
        id: decNodeId,
        type: 'decision',
        badge: 'DECISION 1',
        headline: decisionHeadline.trim() || 'WHAT IS YOUR MOVE?',
        choices: choicesArray,
      },
      [conANodeId]: {
        id: conANodeId,
        type: 'consequence',
        badge: 'CONSEQUENCE',
        badgeColor: 'amber',
        headline: choiceA.headline.trim() || 'THE CONFRONTATION',
        bodyParagraphs: choiceA.body
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean),
        buttonText: 'CONTINUE',
        nextNodeId: climaxNodeId,
      },
      [conBNodeId]: {
        id: conBNodeId,
        type: 'consequence',
        badge: 'CONSEQUENCE',
        badgeColor: 'emerald',
        headline: choiceB.headline.trim() || 'THE OBSERVATION',
        bodyParagraphs: choiceB.body
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean),
        buttonText: 'CONTINUE',
        nextNodeId: climaxNodeId,
      },
    };

    if (includeChoiceC && choiceC.label.trim()) {
      nodes[conCNodeId] = {
        id: conCNodeId,
        type: 'consequence',
        badge: 'CONSEQUENCE',
        badgeColor: 'zinc',
        headline: choiceC.headline.trim() || 'ALTERNATIVE PATH',
        bodyParagraphs: choiceC.body
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean),
        buttonText: 'CONTINUE',
        nextNodeId: climaxNodeId,
      };
    }

    // Climax node linking to Rwamiti ending
    nodes[climaxNodeId] = {
      id: climaxNodeId,
      type: 'climax',
      badge: 'THE OUTCOME',
      badgeColor: 'red',
      headline: 'THE MOMENT OF TRUTH.',
      bodyParagraphs: [
        'The consequences of your move ripple out across the compound.',
        'You pause and take in the silence that follows.',
      ],
      buttonText: 'HEAR UNCLE RWAMITI’S VERDICT',
    };

    // If existing episode had custom preserved nodes beyond start/decision, merge them
    if (episode?.nodes) {
      Object.keys(episode.nodes).forEach((k) => {
        if (!nodes[k]) {
          nodes[k] = episode.nodes[k];
        }
      });
    }

    const compiledEpisode: Episode = {
      id: finalId,
      number: number.trim() || '000',
      title: title.trim(),
      subtitle: subtitle.trim(),
      teaser: teaser.trim() || startParagraphs.split('\n')[0] || title.trim(),
      category: resolvedCategory,
      badge: badge.trim(),
      badgeColor,
      isPremium,
      published,
      initialNodeId: startNodeId,
      rwamitiEnding: {
        headline: endingHeadline.trim() || '“INTERESTING.”',
        quoteLines: [endingQuote1.trim(), endingQuote2.trim()].filter(Boolean),
        closingQuestion: closingQuestion.trim(),
        pollOptions: pollOptions.filter((opt) => opt.trim()),
      },
      recommendedNextEpisodeId: episode?.recommendedNextEpisodeId || 'ep-001',
      sharePrompt: `What would you do in "${title.trim()}"? Play this dilemma on Uncle Rwamiti:`,
      nodes,
      ...({ coverImage } as any),
    };

    sound.playSuccess();
    onSave(compiledEpisode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[92vh] bg-[#12131a] border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-[#0c0d12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e5a93b]/20 border border-[#e5a93b]/50 flex items-center justify-center text-[#e5a93b]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {isEditing ? `Edit Story: ${episode?.title}` : 'Add New Story & Interactive Dilemma'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEditing ? 'Update story content, branching choices, or category' : 'Author a new playable interactive story for the platform'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-[#0e0f16] px-4 overflow-x-auto gap-2 py-2">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('basics');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'basics'
                ? 'bg-[#e5a93b] text-black shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Story Overview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('story');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'story'
                ? 'bg-[#e5a93b] text-black shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Narrative & Choices</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('ending');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ending'
                ? 'bg-[#e5a93b] text-black shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>3. Rwamiti Moral Verdict</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveTab('preview');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-[#e5a93b] text-black shadow-sm'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>4. Card Preview</span>
          </button>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: STORY OVERVIEW */}
          {activeTab === 'basics' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Story Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. THE MIDNIGHT ENCOUNTER"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-bold placeholder:text-zinc-500 focus:outline-none focus:border-[#e5a93b]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Episode Number</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="e.g. 039"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-mono text-center placeholder:text-zinc-500 focus:outline-none focus:border-[#e5a93b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Subtitle / Hook</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. What would you do when secrets surface at midnight?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-[#e5a93b]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">Teaser / Catalog Synopsis</label>
                <textarea
                  value={teaser}
                  onChange={(e) => setTeaser(e.target.value)}
                  rows={2}
                  placeholder="Brief 1-2 sentence dilemma teaser shown in cards and sharing..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-[#e5a93b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#e5a93b]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">Other (Custom category...)</option>
                  </select>
                  {category === 'custom' && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category name"
                      className="w-full mt-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Badge Label & Color</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="e.g. MIDNIGHT • KAMPALA"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs uppercase"
                    />
                    <select
                      value={badgeColor}
                      onChange={(e) => setBadgeColor(e.target.value as any)}
                      className="px-2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs capitalize"
                    >
                      {BADGE_COLORS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Cover Art selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#e5a93b]" />
                  <span>Cover Image</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCoverImage(preset.url)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                        coverImage === preset.url
                          ? 'border-[#e5a93b] bg-[#e5a93b]/10'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-8 h-10 object-cover rounded bg-zinc-950"
                        onError={(e) => {
                          e.currentTarget.src = 'rwamiti.jpg';
                        }}
                      />
                      <span className="text-[11px] font-semibold text-zinc-300 truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Or enter custom image filename/URL"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs"
                />
              </div>

              {/* Status and Tier controls */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white">Publishing Status</div>
                  <div className="text-[11px] text-zinc-400">
                    {published ? 'Story will be immediately visible and playable by visitors.' : 'Saved as private draft in admin console.'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                    published
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: NARRATIVE & CHOICES */}
          {activeTab === 'story' && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="text-xs font-extrabold text-[#e5a93b] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e5a93b]" />
                  <span>SCENE 1: OPENING SITUATION</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Scene Headline</label>
                  <input
                    type="text"
                    value={startHeadline}
                    onChange={(e) => setStartHeadline(e.target.value)}
                    placeholder="e.g. THE MIDNIGHT ENCOUNTER."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Opening Paragraphs (Separate with empty line)</label>
                  <textarea
                    value={startParagraphs}
                    onChange={(e) => setStartParagraphs(e.target.value)}
                    rows={4}
                    placeholder="Describe the initial scene, atmosphere, dilemma, and what the protagonist sees..."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                  />
                </div>

                <div className="w-48 space-y-1">
                  <label className="text-[11px] font-bold text-zinc-400">Button Label</label>
                  <input
                    type="text"
                    value={startButtonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="START"
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs uppercase"
                  />
                </div>
              </div>

              {/* DECISION 1 */}
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-4">
                <div className="text-xs font-extrabold text-[#e5a93b] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e5a93b]" />
                  <span>DECISION: THE CRITICAL FORK</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Decision Headline</label>
                  <input
                    type="text"
                    value={decisionHeadline}
                    onChange={(e) => setDecisionHeadline(e.target.value)}
                    placeholder="WHAT IS YOUR MOVE?"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-bold"
                  />
                </div>

                {/* Choice A */}
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-[11px] font-bold text-amber-400">CHOICE A</div>
                  <input
                    type="text"
                    value={choiceA.label}
                    onChange={(e) => setChoiceA({ ...choiceA, label: e.target.value })}
                    placeholder="A. Option text..."
                    className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={choiceA.headline}
                    onChange={(e) => setChoiceA({ ...choiceA, headline: e.target.value })}
                    placeholder="Consequence Headline"
                    className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold"
                  />
                  <textarea
                    value={choiceA.body}
                    onChange={(e) => setChoiceA({ ...choiceA, body: e.target.value })}
                    rows={2}
                    placeholder="Consequence narrative text..."
                    className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs"
                  />
                </div>

                {/* Choice B */}
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-400">CHOICE B</div>
                  <input
                    type="text"
                    value={choiceB.label}
                    onChange={(e) => setChoiceB({ ...choiceB, label: e.target.value })}
                    placeholder="B. Option text..."
                    className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={choiceB.headline}
                    onChange={(e) => setChoiceB({ ...choiceB, headline: e.target.value })}
                    placeholder="Consequence Headline"
                    className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold"
                  />
                  <textarea
                    value={choiceB.body}
                    onChange={(e) => setChoiceB({ ...choiceB, body: e.target.value })}
                    rows={2}
                    placeholder="Consequence narrative text..."
                    className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs"
                  />
                </div>

                {/* Optional Choice C */}
                {includeChoiceC ? (
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-cyan-400">CHOICE C (OPTIONAL)</span>
                      <button
                        type="button"
                        onClick={() => setIncludeChoiceC(false)}
                        className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Remove Choice C
                      </button>
                    </div>
                    <input
                      type="text"
                      value={choiceC.label}
                      onChange={(e) => setChoiceC({ ...choiceC, label: e.target.value })}
                      placeholder="C. Option text..."
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={choiceC.headline}
                      onChange={(e) => setChoiceC({ ...choiceC, headline: e.target.value })}
                      placeholder="Consequence Headline"
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold"
                    />
                    <textarea
                      value={choiceC.body}
                      onChange={(e) => setChoiceC({ ...choiceC, body: e.target.value })}
                      rows={2}
                      placeholder="Consequence narrative text..."
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-white text-xs"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIncludeChoiceC(true)}
                    className="w-full py-2 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add 3rd Choice (Choice C)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RWAMITI MORAL VERDICT */}
          {activeTab === 'ending' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
                <div className="text-xs font-extrabold text-[#e5a93b] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e5a93b]" />
                  <span>UNCLE RWAMITI’S CLOSING COMMENTARY</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Rwamiti Headline</label>
                  <input
                    type="text"
                    value={endingHeadline}
                    onChange={(e) => setEndingHeadline(e.target.value)}
                    placeholder="“INTERESTING.”"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm font-black"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Wisdom Quote Line 1</label>
                  <input
                    type="text"
                    value={endingQuote1}
                    onChange={(e) => setEndingQuote1(e.target.value)}
                    placeholder="“Every move in Kampala leaves a footprint...”"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs italic"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Wisdom Quote Line 2</label>
                  <input
                    type="text"
                    value={endingQuote2}
                    onChange={(e) => setEndingQuote2(e.target.value)}
                    placeholder="“The question isn’t who started it, but who pays the bill.”"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs italic"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Closing Question for the Audience</label>
                  <input
                    type="text"
                    value={closingQuestion}
                    onChange={(e) => setClosingQuestion(e.target.value)}
                    placeholder="“When the door knocks at midnight, do you look or do you listen?”"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Audience Poll Options</label>
                  <div className="grid grid-cols-3 gap-2">
                    {pollOptions.map((opt, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const next = [...pollOptions];
                          next[idx] = e.target.value;
                          setPollOptions(next);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs text-center uppercase"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CARD PREVIEW */}
          {activeTab === 'preview' && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-xs text-zinc-400 text-center">Live preview of how this story will appear in the catalog:</div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-xl">
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'rwamiti.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#e5a93b] text-black">
                    {badge}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono text-[#e5a93b] font-bold">EPISODE {number || '000'}</span>
                    <h3 className="text-base font-black text-white leading-tight">{title || 'Untitled Dilemma'}</h3>
                    <p className="text-xs text-zinc-300 line-clamp-2 mt-1">{subtitle || teaser}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Category: <strong className="text-zinc-200">{category === 'custom' ? customCategory : category}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    FREE ACCESS
                  </span>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-[#0c0d12] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'basics' && (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  if (activeTab === 'preview') setActiveTab('ending');
                  else if (activeTab === 'ending') setActiveTab('story');
                  else if (activeTab === 'story') setActiveTab('basics');
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
            )}

            {activeTab !== 'preview' ? (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  if (activeTab === 'basics') setActiveTab('story');
                  else if (activeTab === 'story') setActiveTab('ending');
                  else if (activeTab === 'ending') setActiveTab('preview');
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer"
              >
                Next Step →
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#e5a93b] hover:bg-[#d8982a] text-black font-extrabold text-xs tracking-wider uppercase transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Changes' : 'Create & Publish Story'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
