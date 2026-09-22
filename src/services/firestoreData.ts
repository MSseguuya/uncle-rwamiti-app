import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import { getDb } from './firebase';
import { Episode, PlatformConfig } from '../types';
import { LAUNCH_EPISODES } from '../data/launchEpisodes';
import { StorageService, DEFAULT_CONFIG } from './storage';

export class FirestoreDataService {
  private static episodesUnsubscribe: (() => void) | null = null;
  private static configUnsubscribe: (() => void) | null = null;

  /**
   * Initializes Firestore sync:
   * 1. Checks if episodes collection in Firestore has documents.
   * 2. Seeds any missing launch episodes into Firestore.
   * 3. Sets up real-time listener to sync remote changes with local cache.
   */
  static async init(onEpisodesUpdated?: (episodes: Episode[]) => void): Promise<void> {
    try {
      const db = getDb();
      const epCollection = collection(db, 'episodes');
      const snapshot = await getDocs(epCollection);

      const loadedMap = new Map<string, Episode>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Episode;
        if (data && data.id) {
          loadedMap.set(data.id, data);
        }
      });

      // Find any missing or outdated launch episodes
      const missingToSeed: Episode[] = [];
      for (const launchEp of LAUNCH_EPISODES) {
        const existing = loadedMap.get(launchEp.id);
        const epNum = parseInt(launchEp.number, 10);
        const shouldBePremium = !isNaN(epNum) && epNum >= 6;
        const normalizedLaunchEp = {
          ...launchEp,
          isPremium: shouldBePremium,
        };

        if (
          !existing ||
          existing.teaser !== launchEp.teaser ||
          existing.isPremium !== shouldBePremium ||
          !existing.nodes ||
          Object.keys(existing.nodes).length === 0
        ) {
          missingToSeed.push(normalizedLaunchEp);
          loadedMap.set(launchEp.id, normalizedLaunchEp);
        } else {
          loadedMap.set(launchEp.id, {
            ...existing,
            isPremium: shouldBePremium,
          });
        }
      }

      if (missingToSeed.length > 0) {
        console.log(`[Firestore] Syncing ${missingToSeed.length} launch episodes to Firestore with lock flags...`);
        await this.seedEpisodesToFirestore(missingToSeed);
      }

      const allEpisodes = Array.from(loadedMap.values()).map((ep) => {
        const num = parseInt(ep.number, 10);
        return {
          ...ep,
          isPremium: !isNaN(num) ? num >= 6 : ep.isPremium,
        };
      });
      allEpisodes.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
      StorageService.saveEpisodes(allEpisodes);
      if (onEpisodesUpdated) {
        onEpisodesUpdated(allEpisodes);
      }

      // Realtime listener for episodes
      if (this.episodesUnsubscribe) {
        this.episodesUnsubscribe();
      }
      this.episodesUnsubscribe = onSnapshot(epCollection, (snap) => {
        const liveMap = new Map<string, Episode>();
        snap.forEach((d) => {
          const ep = d.data() as Episode;
          if (ep && ep.id) {
            const num = parseInt(ep.number, 10);
            liveMap.set(ep.id, {
              ...ep,
              isPremium: !isNaN(num) ? num >= 6 : ep.isPremium,
            });
          }
        });

        // Ensure launch episodes are never wiped out
        for (const launchEp of LAUNCH_EPISODES) {
          const existing = liveMap.get(launchEp.id);
          const epNum = parseInt(launchEp.number, 10);
          const shouldBePremium = !isNaN(epNum) && epNum >= 6;
          if (!existing || !existing.nodes || Object.keys(existing.nodes).length === 0) {
            liveMap.set(launchEp.id, {
              ...launchEp,
              isPremium: shouldBePremium,
            });
          } else {
            liveMap.set(launchEp.id, {
              ...existing,
              isPremium: shouldBePremium,
            });
          }
        }

        const liveEpisodes = Array.from(liveMap.values());
        liveEpisodes.sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
        StorageService.saveEpisodes(liveEpisodes);
        if (onEpisodesUpdated) {
          onEpisodesUpdated(liveEpisodes);
        }
      }, (err) => {
        console.warn('[Firestore] Episodes snapshot error (falling back to offline cache):', err);
      });

      // Fetch or seed platform config
      const configDocRef = doc(db, 'platformConfig', 'main');
      const configSnap = await getDoc(configDocRef);
      if (!configSnap.exists()) {
        await setDoc(configDocRef, { ...DEFAULT_CONFIG, updatedAt: new Date().toISOString() });
      } else {
        const remoteConfig = configSnap.data() as PlatformConfig;
        StorageService.saveConfig({ ...DEFAULT_CONFIG, ...remoteConfig });
      }
    } catch (err) {
      console.warn('[Firestore] Initialization fallback to local storage:', err);
    }
  }

  /**
   * Seed launch episodes into Cloud Firestore
   */
  static async seedEpisodesToFirestore(episodes: Episode[]): Promise<void> {
    const db = getDb();
    for (const ep of episodes) {
      const epRef = doc(db, 'episodes', ep.id);
      await setDoc(epRef, {
        ...ep,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  }

  /**
   * Saves or updates an episode in Cloud Firestore
   */
  static async saveEpisode(episode: Episode): Promise<void> {
    try {
      const db = getDb();
      const epRef = doc(db, 'episodes', episode.id);
      await setDoc(epRef, {
        ...episode,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving episode:', err);
      throw err;
    }
  }

  /**
   * Records a user's choice to aggregate live crowd peer stats
   */
  static async recordChoiceStat(episodeId: string, nodeId: string, choiceId: string): Promise<void> {
    try {
      const db = getDb();
      const statDocId = `${episodeId}_${nodeId}_${choiceId}`;
      const statRef = doc(db, 'choiceStats', statDocId);
      await setDoc(statRef, {
        episodeId,
        nodeId,
        choiceId,
        count: increment(1),
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error recording choice stat:', err);
    }
  }

  /**
   * Records a poll vote for Uncle Rwamiti's ending question
   */
  static async recordPollVote(episodeId: string, optionIndex: number): Promise<void> {
    try {
      const db = getDb();
      const voteDocId = `${episodeId}_opt_${optionIndex}`;
      const voteRef = doc(db, 'pollVotes', voteDocId);
      await setDoc(voteRef, {
        episodeId,
        optionIndex,
        count: increment(1),
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error recording poll vote:', err);
    }
  }

  /**
   * Saves or updates a subscriber pass in Cloud Firestore
   */
  static async registerSubscriber(subscriber: {
    phoneNumber: string;
    network: 'MTN' | 'Airtel';
    amountPaid: number;
    currency: string;
  }): Promise<void> {
    try {
      const db = getDb();
      const subId = subscriber.phoneNumber.replace(/[^0-9]/g, '');
      const subRef = doc(db, 'subscribers', subId || `sub_${Date.now()}`);
      const now = new Date();
      const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      await setDoc(subRef, {
        phoneNumber: subscriber.phoneNumber,
        network: subscriber.network,
        status: 'active',
        amountPaid: subscriber.amountPaid,
        currency: subscriber.currency,
        subscribedAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error registering subscriber:', err);
    }
  }

  /**
   * Updates platform global configuration
   */
  static async savePlatformConfig(config: PlatformConfig): Promise<void> {
    try {
      const db = getDb();
      const configRef = doc(db, 'platformConfig', 'main');
      await setDoc(configRef, {
        ...config,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.error('[Firestore] Error saving config:', err);
      throw err;
    }
  }
}
