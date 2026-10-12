import { Episode, StoryNode, StoryChoice } from '../types';
import storyDb from './storyDatabase.json';
import { ALL_UPDATED_EPISODES } from './episodes';
import { StoryData, CatalogStory } from '../services/storyDatabaseService';

// 1. Convert all 38 platform catalog stories into full Episode objects
const rawCatalog = (storyDb.catalog || []) as CatalogStory[];
const rawStories = (storyDb.stories || {}) as Record<string, StoryData>;
const rawWisdom = (storyDb.uncleWisdom || {}) as Record<string, string>;

export const CATALOG_EPISODES: Episode[] = rawCatalog.map((story, idx) => {
  const storyData = rawStories[story.slug];
  const rawNodes = storyData?.nodes || {};
  const nodes: Record<string, StoryNode> = {};

  for (const [key, n] of Object.entries(rawNodes)) {
    const isEnding = !!n.is_ending;
    const choices: StoryChoice[] = (n.choices || []).map((c, cIdx) => ({
      id: `${n.key || key}-c${cIdx}`,
      label: c.label,
      nextNodeId: c.to,
      statPercent: 50,
    }));

    nodes[key] = {
      id: n.key || key,
      type: isEnding ? 'climax' : (choices.length > 0 ? 'decision' : 'consequence'),
      headline: n.title || story.title,
      leadText: n.summary || '',
      bodyParagraphs: n.paragraphs && n.paragraphs.length > 0 ? n.paragraphs : (n.summary ? [n.summary] : []),
      choices: choices.length > 0 ? choices : undefined,
      nextNodeId: n.next,
      buttonText: n.next ? 'CONTINUE' : undefined,
    };
  }

  const initialKey = rawNodes['opening'] ? 'opening' : Object.keys(rawNodes)[0] || 'start';

  return {
    id: story.slug,
    number: String(idx + 1).padStart(3, '0'),
    title: story.title,
    teaser: story.description,
    category: story.category || (idx < 14 ? 'Teen Stories' : 'Adult Stories'),
    badge: story.category === 'Teen Stories' ? 'TEEN STORY' : 'ADULT STORY',
    badgeColor: story.category === 'Teen Stories' ? 'zinc' : 'amber',
    isPremium: false,
    published: true,
    initialNodeId: initialKey,
    nodes: nodes,
    rwamitiEnding: {
      headline: 'STORY COMPLETE',
      quoteLines: [
        rawWisdom[story.slug] ||
          'A choice made in haste often reveals what we value in quiet. The question is never only what you chose, but what you were willing to leave behind.',
      ],
      closingQuestion: 'What would you do differently if faced with this move again?',
      pollOptions: ["I stand by my choice", "I would change my move", "Uncle Rwamiti is right"],
    },
    sharePrompt: `I just played ${story.title} on Uncle Rwamiti. Test your move!`,
  };
});

// 2. Format the 12 original Kampala dilemmas with consistent category & sequential numbering
export const KAMPALA_COVERS: Record<string, string> = {
  'ep-001': 'cover-match-you-missed.webp', // 2% Battery
  'ep-002': 'cover-red-ledger.webp',        // Everybody Took One
  'ep-003': 'cover-extra-500000.webp',     // UGX 500,000
  'ep-004': 'cover-what-we-havent-said.webp', // Delete That Photo
  'ep-005': 'cover-voice-note.webp',       // She Says She's Late
  'ep-006': 'cover-one-more-bet.webp',      // Just One Bet
  'ep-007': 'cover-house-key.webp',         // Don't Tell Mum
  'ep-008': 'cover-second-phone.webp',     // 10,000 Followers
  'ep-009': 'cover-borrowed-name.webp',    // He Hit Him First
  'ep-010': 'cover-guest-room.webp',       // The Answer Is Already on AI
  'ep-011': 'cover-lake-photograph.webp',  // Kampala 2040
  'ep-012': 'cover-school-fees.webp',      // Dad's Job Disappeared
  'ep-013': 'cover-because-i-said-so.webp', // Because I Said So
};

export const KAMPALA_EPISODES: Episode[] = ALL_UPDATED_EPISODES.map((ep, idx) => ({
  ...ep,
  number: String(CATALOG_EPISODES.length + idx + 1).padStart(3, '0'),
  category: 'Kampala Dilemmas',
  subtitle: `Kampala Dilemma • EP ${ep.number}`,
  badge: ep.badge || `EPISODE ${ep.number}`,
  badgeColor: ep.badgeColor || 'amber',
  coverImage: KAMPALA_COVERS[ep.id] || 'rwamiti.jpg',
}));

// 3. Combined unified list of all 50 interactive games
export const ALL_INCORPORATED_EPISODES: Episode[] = [
  ...CATALOG_EPISODES,
  ...KAMPALA_EPISODES,
];

// Helper to convert an Episode into StoryData for seamless playing in StorySceneReader
export function convertEpisodeToStoryData(ep: Episode): StoryData {
  const nodes: Record<string, any> = {};

  for (const [key, n] of Object.entries(ep.nodes)) {
    const choices = [];
    if (n.choices && n.choices.length > 0) {
      for (const c of n.choices) {
        choices.push({ label: c.label, to: c.nextNodeId });
      }
    } else if (n.nextNodeId) {
      choices.push({ label: n.buttonText || 'CONTINUE', to: n.nextNodeId });
    }

    nodes[key] = {
      key: n.id,
      title: n.headline,
      summary: n.leadText || '',
      paragraphs: n.bodyParagraphs && n.bodyParagraphs.length > 0 ? n.bodyParagraphs : [n.leadText || ''],
      choices: choices,
      is_ending: n.type === 'climax' || choices.length === 0,
    };
  }

  // Ensure opening node exists as entrypoint
  if (!nodes['opening'] && nodes[ep.initialNodeId]) {
    nodes['opening'] = { ...nodes[ep.initialNodeId], key: 'opening' };
  }

  return {
    id: ep.id,
    title: ep.title,
    image: (ep as any).coverImage || KAMPALA_COVERS[ep.id] || 'rwamiti.jpg',
    category: ep.category || 'Kampala Dilemmas',
    nodes: nodes,
  };
}
