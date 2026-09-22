import { Episode, PlatformConfig, UserState } from '../types';
import { LAUNCH_EPISODES } from '../data/launchEpisodes';

const STORAGE_KEYS = {
  EPISODES: 'rwamiti_episodes_v2',
  CONFIG: 'rwamiti_config_v1',
  USER_STATE: 'rwamiti_user_state_v3',
  PHOTO: 'rwamiti_official_photo_v1',
};

export const DEFAULT_CONFIG: PlatformConfig = {
  subscriptionPriceUgx: 5000,
  subscriptionPriceLabel: 'UGX 5,000 / month',
  currency: 'UGX',
  defaultPaymentNumber: '0772988640',
  merchantName: 'Uncle Rwamiti / Your Move',
  showAggregateStats: true,
  allowInstantFreeTrial: true,
};

export const DEFAULT_USER_STATE: UserState = {
  isPremium: false,
  completedEpisodeIds: [],
  replayedEpisodeIds: [],
  userChoices: {},
  soundEnabled: true,
};

export class StorageService {
  // Episodes
  static getEpisodes(): Episode[] {
    if (typeof window === 'undefined') return LAUNCH_EPISODES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EPISODES);
      let parsed: Episode[];
      if (!stored) {
        parsed = [...LAUNCH_EPISODES];
        localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(LAUNCH_EPISODES));
      } else {
        const decoded = JSON.parse(stored);
        parsed = Array.isArray(decoded) && decoded.length > 0 ? decoded : [...LAUNCH_EPISODES];
      }

      // Always ensure all 10 core launch episodes exist and have complete node data
      const existingMap = new Map<string, Episode>();
      parsed.forEach((ep) => {
        if (ep && ep.id) {
          existingMap.set(ep.id, ep);
        }
      });

      for (const launchEp of LAUNCH_EPISODES) {
        const existing = existingMap.get(launchEp.id);
        if (!existing) {
          existingMap.set(launchEp.id, launchEp);
        } else {
          existingMap.set(launchEp.id, {
            ...launchEp,
            published: existing.published !== undefined ? existing.published : launchEp.published,
            isPremium: existing.isPremium !== undefined ? existing.isPremium : launchEp.isPremium,
          });
        }
      }

      const merged = Array.from(existingMap.values());

      // Strictly enforce: Episodes 006 to 010 are NOT free (isPremium: true)
      // Episodes 001 to 005 are free (isPremium: false)
      const sanitized = merged.map((ep) => {
        const num = parseInt(ep.number, 10);
        if (!isNaN(num)) {
          return {
            ...ep,
            isPremium: num >= 6,
          };
        }
        return ep;
      });

      sanitized.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
      return sanitized;
    } catch (e) {
      console.error('Failed to load episodes from storage:', e);
      return LAUNCH_EPISODES;
    }
  }

  static saveEpisodes(episodes: Episode[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
    } catch (e) {
      console.error('Failed to save episodes to storage:', e);
    }
  }

  static getEpisodeById(id: string): Episode | undefined {
    const episodes = this.getEpisodes();
    return episodes.find((ep) => ep.id === id || ep.number === id);
  }

  static saveEpisode(updated: Episode): Episode[] {
    const episodes = this.getEpisodes();
    const index = episodes.findIndex((ep) => ep.id === updated.id);
    let newEpisodes: Episode[];
    if (index >= 0) {
      newEpisodes = [...episodes];
      newEpisodes[index] = updated;
    } else {
      newEpisodes = [...episodes, updated];
    }
    this.saveEpisodes(newEpisodes);
    return newEpisodes;
  }

  static deleteEpisode(id: string): Episode[] {
    const episodes = this.getEpisodes().filter((ep) => ep.id !== id);
    this.saveEpisodes(episodes);
    return episodes;
  }

  static resetEpisodesToDefault(): Episode[] {
    this.saveEpisodes(LAUNCH_EPISODES);
    return LAUNCH_EPISODES;
  }

  // Configuration
  static getConfig(): PlatformConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
        return DEFAULT_CONFIG;
      }
      const parsed = { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      // Strip any spaces from the payment number
      if (parsed.defaultPaymentNumber) {
        parsed.defaultPaymentNumber = parsed.defaultPaymentNumber.replace(/\s+/g, '');
      }
      if (!parsed.defaultPaymentNumber) {
        parsed.defaultPaymentNumber = '0772988640';
      }
      return parsed;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  static saveConfig(config: PlatformConfig): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  }

  // User State
  static getUserState(): UserState {
    if (typeof window === 'undefined') return DEFAULT_USER_STATE;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_STATE);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.USER_STATE, JSON.stringify(DEFAULT_USER_STATE));
        return DEFAULT_USER_STATE;
      }
      return { ...DEFAULT_USER_STATE, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_USER_STATE;
    }
  }

  static saveUserState(state: UserState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATE, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save user state:', e);
    }
  }

  // Official Uncle Rwamiti Photo
  static getRwamitiPhoto(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.PHOTO);
    } catch {
      return null;
    }
  }

  static saveRwamitiPhoto(dataUrl: string | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (dataUrl) {
        localStorage.setItem(STORAGE_KEYS.PHOTO, dataUrl);
      } else {
        localStorage.removeItem(STORAGE_KEYS.PHOTO);
      }
    } catch (e) {
      console.error('Failed to save Uncle Rwamiti photo:', e);
    }
  }

  // Backup and Restore (Requirement 12)
  static exportBackup(): string {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      episodes: this.getEpisodes(),
      config: this.getConfig(),
    };
    return JSON.stringify(backupData, null, 2);
  }

  static importBackup(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.episodes)) {
        return { success: false, error: 'Invalid backup file format: missing episodes array.' };
      }
      this.saveEpisodes(data.episodes);
      if (data.config) {
        this.saveConfig({ ...DEFAULT_CONFIG, ...data.config });
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to parse JSON file' };
    }
  }
}
