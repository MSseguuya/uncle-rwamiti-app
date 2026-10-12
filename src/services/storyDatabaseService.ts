import storyDb from '../data/storyDatabase.json';
import {
  ALL_INCORPORATED_EPISODES,
  KAMPALA_EPISODES,
  KAMPALA_COVERS,
  convertEpisodeToStoryData,
} from '../data/allGamesDatabase';

export interface CatalogStory {
  slug: string;
  title: string;
  description: string;
  cover: string;
  duration_minutes: number;
  reading_time?: string;
  category: string;
  keywords: string;
  legacy_engine?: boolean;
  featured?: boolean;
}

export interface StoryNodeChoice {
  label: string;
  to: string;
  flag?: string | null;
}

export interface StoryDataNode {
  key: string;
  title: string;
  summary: string;
  paragraphs: string[];
  image?: string;
  is_ending?: boolean;
  choices?: StoryNodeChoice[];
  next?: string;
}

export interface StoryData {
  id: string;
  title: string;
  image: string;
  category: string;
  edition?: number;
  entrances?: Record<string, Record<string, string>>;
  nodes: Record<string, StoryDataNode>;
}

export interface StoryProgress {
  id: string;
  node: string;
  history: string[];
  trail: Array<{ from: string; to: string; label: string }>;
  completed: boolean;
  seenEndings: string[];
  previous?: {
    trail: Array<{ from: string; to: string; label: string }>;
    ending: string;
  } | null;
}

const STORAGE_SAVED_KEY = 'rw_saved';
const STORAGE_PROGRESS_KEY = 'rw_progress';
const STORAGE_THEME_KEY = 'rw_theme';
const STORAGE_TEXT_SIZE_KEY = 'rw_text_size';

export class StoryDatabaseService {
  private static buildCatalog(): CatalogStory[] {
    const base = (storyDb.catalog as CatalogStory[]) || [];
    const kampalaStories: CatalogStory[] = KAMPALA_EPISODES.map((ep) => ({
      slug: ep.id,
      title: ep.title,
      description: ep.teaser,
      cover: (ep as any).coverImage || KAMPALA_COVERS[ep.id] || 'cover-match-you-missed.webp',
      duration_minutes: 6,
      reading_time: '4–6 min · interactive',
      category: 'Kampala Dilemmas',
      keywords: `Kampala Dilemmas ${ep.title} ${ep.teaser} episode ${ep.number}`,
      legacy_engine: false,
    }));

    // Replace any duplicates in base if they share the same slug or title
    const kampalaTitleMap = new Set(kampalaStories.map((k) => k.title.toLowerCase().trim()));
    const kampalaSlugMap = new Set(kampalaStories.map((k) => k.slug.toLowerCase().trim()));

    const filteredBase = base.filter(
      (s) =>
        !kampalaSlugMap.has(s.slug.toLowerCase().trim()) &&
        !kampalaTitleMap.has(s.title.toLowerCase().trim())
    );

    return [...filteredBase, ...kampalaStories];
  }

  private static catalog: CatalogStory[] = StoryDatabaseService.buildCatalog();
  private static stories: Record<string, StoryData> = storyDb.stories as Record<string, StoryData>;
  private static wisdom: Record<string, string> = storyDb.uncleWisdom as Record<string, string>;

  static getCatalog(): CatalogStory[] {
    return this.catalog;
  }

  static getFeaturedStory(): CatalogStory {
    return (
      this.catalog.find((s) => s.slug === 'the-match-you-missed') ||
      this.catalog.find((s) => s.featured) ||
      this.catalog[0]
    );
  }

  static getTeenStories(): CatalogStory[] {
    return this.catalog.filter((s) => s.category === 'Teen Stories');
  }

  static getAdultStories(): CatalogStory[] {
    return this.catalog.filter((s) => s.category === 'Adult Stories');
  }

  static getKampalaDilemmas(): CatalogStory[] {
    return this.catalog.filter((s) => s.category === 'Kampala Dilemmas');
  }

  static getStory(slug: string): StoryData | null {
    if (this.stories[slug]) return this.stories[slug];
    const foundEp = ALL_INCORPORATED_EPISODES.find((e) => e.id === slug || e.id.toLowerCase() === slug.toLowerCase());
    if (foundEp) {
      return convertEpisodeToStoryData(foundEp);
    }
    return null;
  }

  static findCatalogStory(slug: string): CatalogStory | null {
    const fromCat = this.catalog.find((s) => s.slug === slug);
    if (fromCat) return fromCat;
    const foundEp = ALL_INCORPORATED_EPISODES.find((e) => e.id === slug);
    if (foundEp) {
      return {
        slug: foundEp.id,
        title: foundEp.title,
        description: foundEp.teaser,
        cover: (foundEp as any).coverImage || 'rwamiti.jpg',
        duration_minutes: 5,
        reading_time: '4–6 min · estimated',
        category: foundEp.category || 'Kampala Dilemmas',
        keywords: `${foundEp.category || 'Kampala Dilemmas'} ${foundEp.title} ${foundEp.teaser}`,
        legacy_engine: false,
      };
    }
    return null;
  }

  static getUncleWisdom(slug: string): string {
    return (
      this.wisdom[slug] ||
      'A choice made in haste often reveals what we value in quiet. The question is never only what you chose, but what you were willing to leave behind.'
    );
  }

  // Saved Stories / My List
  static getSavedSlugs(): Set<string> {
    try {
      const data = localStorage.getItem(STORAGE_SAVED_KEY);
      if (data) return new Set(JSON.parse(data));
    } catch (e) {
      console.warn('Failed reading saved stories', e);
    }
    return new Set<string>();
  }

  static toggleSaved(slug: string): boolean {
    const saved = this.getSavedSlugs();
    let isNowSaved = false;
    if (saved.has(slug)) {
      saved.delete(slug);
      isNowSaved = false;
    } else {
      saved.add(slug);
      isNowSaved = true;
    }
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify([...saved]));
    } catch (e) {
      console.warn('Failed saving story to storage', e);
    }
    return isNowSaved;
  }

  static isSaved(slug: string): boolean {
    return this.getSavedSlugs().has(slug);
  }

  // Progress tracking
  static getAllProgress(): Record<string, StoryProgress> {
    try {
      const data = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed reading story progress', e);
    }
    return {};
  }

  static getProgress(slug: string): StoryProgress | null {
    const all = this.getAllProgress();
    return all[slug] || null;
  }

  static saveProgress(progress: StoryProgress): void {
    const all = this.getAllProgress();
    all[progress.id] = progress;
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(all));
    } catch (e) {
      console.warn('Failed writing story progress', e);
    }
  }

  static getTheme(): 'dark' | 'light' {
    try {
      const t = localStorage.getItem(STORAGE_THEME_KEY);
      if (t === 'light') return 'light';
    } catch (e) {
      // default dark
    }
    return 'dark';
  }

  static setTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
      document.documentElement.dataset.theme = theme;
    } catch (e) {
      console.warn('Failed saving theme', e);
    }
  }

  static getTextSize(): 'standard' | 'large' | 'extra' {
    try {
      const s = localStorage.getItem(STORAGE_TEXT_SIZE_KEY);
      if (s === 'large' || s === 'extra') return s;
    } catch (e) {
      // default standard
    }
    return 'standard';
  }

  static setTextSize(size: 'standard' | 'large' | 'extra'): void {
    try {
      localStorage.setItem(STORAGE_TEXT_SIZE_KEY, size);
      document.documentElement.dataset.textSize = size;
    } catch (e) {
      console.warn('Failed saving text size', e);
    }
  }
}
