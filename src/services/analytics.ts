import {
  AnalyticsEvent,
  GameSessionRecord,
  GameSessionChoice,
  PlayerDemographics,
  StoryStage,
  VisitorRecord,
} from '../types';
import { getDb } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  increment,
} from 'firebase/firestore';

const ANALYTICS_KEY = 'rwamiti_real_events_v4';
const DEMOGRAPHICS_KEY = 'rwamiti_real_demographics_v4';
const VISITOR_KEY = 'rwamiti_real_visitor_v4';
const LOCAL_SESSIONS_KEY = 'rwamiti_real_sessions_v4';
const LOCAL_VISITORS_KEY = 'rwamiti_real_visitors_list_v4';

export const UGANDA_DISTRICTS = [
  'Kampala (Central / Nakawa / Kawempe / Makindye / Rubaga)',
  'Wakiso (Entebbe / Kira / Nansana / Kasangati)',
  'Mukono',
  'Jinja & Busoga',
  'Mbarara & Western Uganda',
  'Gulu & Northern Uganda',
  'Arua & West Nile',
  'Masaka & Greater Masaka',
  'Mbale & Eastern Uganda',
  'Fort Portal & Rwenzori',
  'Kabale & Kigezi',
  'Other Districts in Uganda',
  'Diaspora / International',
] as const;

export const AGE_BRACKETS = [
  'Under 13',
  '13–17 (Teens)',
  '18–24 (Youth)',
  '25–34',
  '35+',
] as const;

export const GENDER_OPTIONS = [
  'Female',
  'Male',
  'Other',
  'Prefer not to say',
] as const;

export class AnalyticsService {
  private static currentActiveDocId: string | null = null;
  private static currentEpisodeId: string | null = null;
  private static currentEpisodeChoices: GameSessionChoice[] = [];

  // =============================================================
  // 1. UNIQUE VISITOR IDENTIFICATION & SESSION TRACKING
  // =============================================================

  static getOrCreateVisitorId(): string {
    if (typeof window === 'undefined') return 'server_visitor';
    try {
      let vid = localStorage.getItem(VISITOR_KEY);
      if (!vid) {
        vid = 'vid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem(VISITOR_KEY, vid);
      }
      return vid;
    } catch {
      return 'vid_fallback_' + Math.random().toString(36).substring(2, 8);
    }
  }

  static detectReferralSource(): string {
    if (typeof window === 'undefined') return 'Direct / Organic';
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const ref = params.get('ref') || params.get('source') || params.get('utm_source');

      if (ref) {
        const lower = ref.toLowerCase();
        if (lower.includes('whatsapp') || lower.includes('wa')) return 'WhatsApp Challenge Link';
        if (lower.includes('challenge')) return 'Friend Challenge Link';
        if (lower.includes('fb') || lower.includes('facebook')) return 'Facebook Share';
        if (lower.includes('x') || lower.includes('twitter')) return 'X / Twitter Share';
        if (lower.includes('tiktok')) return 'TikTok Referral';
        return `Campaign: ${ref}`;
      }

      if (params.get('episode')) {
        return 'Episode Deep-Link';
      }

      if (document.referrer) {
        const refUrl = document.referrer.toLowerCase();
        if (refUrl.includes('whatsapp') || refUrl.includes('api.whatsapp.com')) return 'WhatsApp';
        if (refUrl.includes('facebook.com') || refUrl.includes('fb.com')) return 'Facebook';
        if (refUrl.includes('t.co') || refUrl.includes('twitter.com')) return 'X / Twitter';
        if (refUrl.includes('google.com')) return 'Google Search';
        return new URL(document.referrer).hostname;
      }
    } catch {
      // ignore
    }
    return 'Direct / Organic';
  }

  static detectCountryOrTimezone(): string {
    if (typeof window === 'undefined') return 'Uganda (EAT)';
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz) return 'East Africa (Uganda)';
      if (tz === 'Africa/Kampala') return 'Uganda (Africa/Kampala)';
      if (tz.startsWith('Africa/')) return `${tz} (Africa)`;
      if (tz.startsWith('Europe/')) return `${tz} (Diaspora / Europe)`;
      if (tz.startsWith('America/')) return `${tz} (Diaspora / Americas)`;
      if (tz.startsWith('Asia/')) return `${tz} (Asia / Gulf)`;
      return tz;
    } catch {
      return 'East Africa (Uganda)';
    }
  }

  static detectDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
    if (typeof window === 'undefined') return 'Mobile';
    const ua = navigator.userAgent.toLowerCase();
    if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
      return 'Tablet';
    }
    if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/.test(ua)) {
      return 'Mobile';
    }
    return window.innerWidth < 768 ? 'Mobile' : 'Desktop';
  }

  /**
   * Records or updates a real visitor in Firestore and localStorage on app mount.
   * Tracks visitCount, firstVisit, lastVisit, referral source, device, and demographics.
   */
  static async recordVisitorVisit(): Promise<VisitorRecord> {
    const visitorId = this.getOrCreateVisitorId();
    const demo = this.getPlayerDemographics();
    const deviceType = this.detectDeviceType();
    const referralSource = this.detectReferralSource();
    const countryOrTimezone = this.detectCountryOrTimezone();
    const now = Date.now();

    // Check existing stored visitor
    let localVisitor: VisitorRecord | null = null;
    try {
      const stored = localStorage.getItem('rwamiti_visitor_record');
      if (stored) {
        localVisitor = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    const isNew = !localVisitor;
    const visitCount = (localVisitor?.visitCount || 0) + 1;
    const firstVisit = localVisitor?.firstVisit || now;
    const gamesPlayed = localVisitor?.gamesPlayed || 0;
    const gamesCompleted = localVisitor?.gamesCompleted || 0;
    const replaysCount = localVisitor?.replaysCount || 0;

    const record: VisitorRecord = {
      visitorId,
      visitCount,
      firstVisit,
      lastVisit: now,
      isReturning: visitCount > 1,
      referralSource: isNew ? referralSource : (localVisitor?.referralSource || referralSource),
      deviceType,
      countryOrTimezone,
      gamesPlayed,
      gamesCompleted,
      replaysCount,
      ageBracket: demo.ageBracket || 'Undisclosed',
      gender: demo.gender || 'Prefer not to say',
      location: demo.location || 'Undisclosed',
    };

    try {
      localStorage.setItem('rwamiti_visitor_record', JSON.stringify(record));
    } catch {
      // ignore
    }

    // Persist to Cloud Firestore
    try {
      const db = getDb();
      const visitorRef = doc(db, 'visitors', visitorId);
      await setDoc(visitorRef, {
        ...record,
        lastSeenAt: new Date(now).toISOString(),
        firstSeenAt: new Date(firstVisit).toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('[Analytics] Could not write visitor to Firestore:', err);
    }

    return record;
  }

  // =============================================================
  // 2. DEMOGRAPHICS (AGE, GENDER, UGANDA DISTRICT)
  // =============================================================

  static getPlayerDemographics(): PlayerDemographics {
    if (typeof window === 'undefined') {
      return {
        ageBracket: 'Undisclosed',
        gender: 'Prefer not to say',
        location: 'Undisclosed',
        hasSubmitted: false,
      };
    }
    try {
      const stored = localStorage.getItem(DEMOGRAPHICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read player demographics:', e);
    }
    return {
      ageBracket: 'Undisclosed',
      gender: 'Prefer not to say',
      location: 'Undisclosed',
      hasSubmitted: false,
    };
  }

  static savePlayerDemographics(demo: Partial<PlayerDemographics>): PlayerDemographics {
    if (typeof window === 'undefined') {
      return {
        ageBracket: demo.ageBracket || 'Undisclosed',
        gender: demo.gender || 'Prefer not to say',
        location: demo.location || 'Undisclosed',
        hasSubmitted: true,
      };
    }
    try {
      const current = this.getPlayerDemographics();
      const updated: PlayerDemographics = {
        ...current,
        ...demo,
        hasSubmitted: true,
      };
      localStorage.setItem(DEMOGRAPHICS_KEY, JSON.stringify(updated));

      // Also update visitor record in Firestore
      const visitorId = this.getOrCreateVisitorId();
      try {
        const db = getDb();
        const visitorRef = doc(db, 'visitors', visitorId);
        updateDoc(visitorRef, {
          ageBracket: updated.ageBracket,
          gender: updated.gender,
          location: updated.location,
          updatedAt: new Date().toISOString(),
        }).catch(() => {});
      } catch {
        // ignore
      }

      this.track('demographics_updated', {
        metadata: {
          ageBracket: updated.ageBracket,
          gender: updated.gender,
          location: updated.location,
        },
      });

      return updated;
    } catch (e) {
      console.error('Failed to save player demographics:', e);
      return {
        ageBracket: demo.ageBracket || 'Undisclosed',
        gender: demo.gender || 'Prefer not to say',
        location: demo.location || 'Undisclosed',
        hasSubmitted: true,
      };
    }
  }

  // =============================================================
  // 3. REAL GAMEPLAY SESSIONS LIFECYCLE (START -> PROGRESS -> COMPLETE)
  // =============================================================

  static async startRealGameSession(data: {
    episodeId: string;
    episodeNumber: string;
    episodeTitle: string;
    isReplay?: boolean;
    initialNodeId?: string;
    initialNodeTitle?: string;
  }): Promise<string | null> {
    const visitorId = this.getOrCreateVisitorId();
    const demo = this.getPlayerDemographics();
    const deviceType = this.detectDeviceType();
    const referralSource = this.detectReferralSource();
    const countryOrTimezone = this.detectCountryOrTimezone();
    const timestamp = Date.now();
    const dateStr = new Date(timestamp).toLocaleString();

    this.currentEpisodeId = data.episodeId;
    this.currentEpisodeChoices = [];

    const sessionPayload: Omit<GameSessionRecord, 'id'> = {
      visitorId,
      timestamp,
      dateStr,
      episodeId: data.episodeId,
      episodeNumber: data.episodeNumber,
      episodeTitle: data.episodeTitle,
      ageBracket: demo.ageBracket || 'Undisclosed',
      gender: demo.gender || 'Prefer not to say',
      location: demo.location || 'Undisclosed',
      deviceType,
      stageReached: 'opened',
      dropOffNodeId: data.initialNodeId || 'start',
      dropOffNodeTitle: data.initialNodeTitle || 'Story Intro / Starting Crossroad',
      choices: [],
      choicesCount: 0,
      completed: false,
      isReplay: !!data.isReplay,
      referralSource,
      countryOrTimezone,
    };

    // Increment visitor's gamesPlayed counter in Firestore
    try {
      const db = getDb();
      const visitorRef = doc(db, 'visitors', visitorId);
      updateDoc(visitorRef, {
        gamesPlayed: increment(1),
        replaysCount: data.isReplay ? increment(1) : increment(0),
        lastPlayedEpisodeId: data.episodeId,
        lastPlayedAt: new Date(timestamp).toISOString(),
      }).catch(() => {});
    } catch {
      // ignore
    }

    try {
      const db = getDb();
      const docRef = await addDoc(collection(db, 'gameSessions'), {
        ...sessionPayload,
        createdAt: new Date().toISOString(),
      });
      this.currentActiveDocId = docRef.id;

      const localRecord: GameSessionRecord = {
        id: docRef.id,
        ...sessionPayload,
      };
      this.saveLocalSession(localRecord);
      return docRef.id;
    } catch (err) {
      console.warn('[Analytics] Could not write session to Firestore (caching locally):', err);
      const fallbackId = 'local_' + Math.random().toString(36).substring(2, 9);
      this.currentActiveDocId = fallbackId;
      this.saveLocalSession({
        id: fallbackId,
        ...sessionPayload,
      });
      return fallbackId;
    }
  }

  static async updateRealGameSessionChoice(data: {
    nodeId: string;
    nodeTitle?: string;
    choiceId: string;
    choiceLabel: string;
    totalChoicesMade: number;
    isClimax?: boolean;
  }): Promise<void> {
    const choiceItem: GameSessionChoice = {
      nodeId: data.nodeId,
      choiceId: data.choiceId,
      choiceLabel: data.choiceLabel,
      timestamp: Date.now(),
    };
    this.currentEpisodeChoices.push(choiceItem);

    // Determine current stage for drop-off funnel
    let stage: StoryStage = 'first_choice';
    if (data.isClimax) {
      stage = 'climax';
    } else if (data.totalChoicesMade > 1) {
      stage = 'mid_story';
    }

    // Update local cache
    try {
      const sessions = this.getLocalGameSessions();
      const idx = sessions.findIndex((s) => s.id === this.currentActiveDocId);
      if (idx !== -1) {
        sessions[idx].choicesCount = data.totalChoicesMade;
        sessions[idx].stageReached = stage;
        sessions[idx].dropOffNodeId = data.nodeId;
        sessions[idx].dropOffNodeTitle = data.nodeTitle || data.nodeId;
        sessions[idx].choices.push(choiceItem);
        localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
      }
    } catch {
      // ignore
    }

    // Update in Firestore
    if (this.currentActiveDocId && !this.currentActiveDocId.startsWith('local_')) {
      try {
        const db = getDb();
        const docRef = doc(db, 'gameSessions', this.currentActiveDocId);
        await updateDoc(docRef, {
          choicesCount: data.totalChoicesMade,
          stageReached: stage,
          dropOffNodeId: data.nodeId,
          dropOffNodeTitle: data.nodeTitle || data.nodeId,
          choices: this.currentEpisodeChoices,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('[Analytics] Could not update session choice in Firestore:', err);
      }
    }
  }

  static async completeRealGameSession(data: {
    episodeId: string;
    episodeNumber: string;
    episodeTitle: string;
    choicesCount: number;
    pollOption?: string;
    isReplay?: boolean;
  }): Promise<void> {
    const visitorId = this.getOrCreateVisitorId();
    const demo = this.getPlayerDemographics();
    const deviceType = this.detectDeviceType();
    const referralSource = this.detectReferralSource();
    const countryOrTimezone = this.detectCountryOrTimezone();
    const timestamp = Date.now();
    const dateStr = new Date(timestamp).toLocaleString();

    // Increment visitor's gamesCompleted in Firestore
    try {
      const db = getDb();
      const visitorRef = doc(db, 'visitors', visitorId);
      updateDoc(visitorRef, {
        gamesCompleted: increment(1),
        lastCompletedEpisodeId: data.episodeId,
        lastCompletedAt: new Date(timestamp).toISOString(),
      }).catch(() => {});
    } catch {
      // ignore
    }

    if (this.currentActiveDocId && !this.currentActiveDocId.startsWith('local_')) {
      try {
        const db = getDb();
        const docRef = doc(db, 'gameSessions', this.currentActiveDocId);
        await updateDoc(docRef, {
          completed: true,
          stageReached: 'completed',
          dropOffNodeId: 'completed',
          dropOffNodeTitle: 'Story Climax & Moral Verdict Completed',
          choicesCount: data.choicesCount,
          pollOption: data.pollOption || '',
          completedAt: new Date().toISOString(),
          ageBracket: demo.ageBracket || 'Undisclosed',
          gender: demo.gender || 'Prefer not to say',
          location: demo.location || 'Undisclosed',
        });

        // Update local session
        const sessions = this.getLocalGameSessions();
        const idx = sessions.findIndex((s) => s.id === this.currentActiveDocId);
        if (idx !== -1) {
          sessions[idx].completed = true;
          sessions[idx].stageReached = 'completed';
          sessions[idx].dropOffNodeId = 'completed';
          sessions[idx].dropOffNodeTitle = 'Story Completed';
          sessions[idx].choicesCount = data.choicesCount;
          sessions[idx].pollOption = data.pollOption;
          localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
        }
        return;
      } catch (err) {
        console.warn('[Analytics] Could not update completion in Firestore, fallback to addDoc:', err);
      }
    }

    // Direct addDoc fallback
    const sessionRecord: GameSessionRecord = {
      id: 'gs_' + Math.random().toString(36).substring(2, 10),
      visitorId,
      timestamp,
      dateStr,
      episodeId: data.episodeId,
      episodeNumber: data.episodeNumber,
      episodeTitle: data.episodeTitle,
      ageBracket: demo.ageBracket || 'Undisclosed',
      gender: demo.gender || 'Prefer not to say',
      location: demo.location || 'Undisclosed',
      deviceType,
      stageReached: 'completed',
      dropOffNodeId: 'completed',
      dropOffNodeTitle: 'Story Completed',
      choices: this.currentEpisodeChoices,
      choicesCount: data.choicesCount,
      completed: true,
      completedAt: new Date().toISOString(),
      isReplay: !!data.isReplay,
      pollOption: data.pollOption,
      referralSource,
      countryOrTimezone,
    };

    this.saveLocalSession(sessionRecord);

    try {
      const db = getDb();
      await addDoc(collection(db, 'gameSessions'), {
        ...sessionRecord,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Analytics] Could not write completed session to Firestore:', err);
    }
  }

  // Backward compatibility alias
  static async recordGameSession(data: {
    episodeId: string;
    episodeNumber: string;
    episodeTitle: string;
    completed: boolean;
    choicesCount: number;
    pollOption?: string;
  }): Promise<void> {
    if (data.completed) {
      await this.completeRealGameSession(data);
    } else {
      await this.startRealGameSession(data);
    }
  }

  private static saveLocalSession(record: GameSessionRecord): void {
    try {
      const local = this.getLocalGameSessions();
      const existingIdx = local.findIndex((s) => s.id === record.id);
      if (existingIdx !== -1) {
        local[existingIdx] = record;
      } else {
        local.unshift(record);
      }
      localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(local.slice(0, 300)));
    } catch {
      // ignore
    }
  }

  static getLocalGameSessions(): GameSessionRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_SESSIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  }

  static getLocalVisitors(): VisitorRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_VISITORS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  }

  // =============================================================
  // 4. REAL-TIME FIRESTORE LISTENERS
  // =============================================================

  static subscribeToGameSessions(callback: (sessions: GameSessionRecord[]) => void): () => void {
    try {
      const db = getDb();
      const sessionsRef = collection(db, 'gameSessions');
      const q = query(sessionsRef, orderBy('timestamp', 'desc'), limit(300));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: GameSessionRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as any;
            list.push({
              id: docSnap.id,
              visitorId: data.visitorId || 'legacy_visitor',
              timestamp: data.timestamp || Date.now(),
              dateStr: data.dateStr || new Date(data.timestamp || Date.now()).toLocaleString(),
              episodeId: data.episodeId || '',
              episodeNumber: data.episodeNumber || '',
              episodeTitle: data.episodeTitle || '',
              ageBracket: data.ageBracket || 'Undisclosed',
              gender: data.gender || 'Prefer not to say',
              location: data.location || 'Undisclosed',
              deviceType: data.deviceType || 'Mobile',
              stageReached: data.stageReached || (data.completed ? 'completed' : 'opened'),
              dropOffNodeId: data.dropOffNodeId,
              dropOffNodeTitle: data.dropOffNodeTitle,
              choices: Array.isArray(data.choices) ? data.choices : [],
              choicesCount: data.choicesCount || 0,
              completed: !!data.completed,
              completedAt: data.completedAt,
              isReplay: !!data.isReplay,
              pollOption: data.pollOption,
              referralSource: data.referralSource || 'Direct / Organic',
              countryOrTimezone: data.countryOrTimezone || 'Uganda (EAT)',
            });
          });

          try {
            if (typeof window !== 'undefined' && list.length > 0) {
              localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list));
            }
          } catch {
            // ignore
          }

          callback(list);
        },
        (error) => {
          console.warn('[Analytics] Firestore gameSessions subscribe error:', error);
          callback(this.getLocalGameSessions());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('[Analytics] Firestore init error in subscribeToGameSessions:', err);
      callback(this.getLocalGameSessions());
      return () => {};
    }
  }

  static subscribeToVisitors(callback: (visitors: VisitorRecord[]) => void): () => void {
    try {
      const db = getDb();
      const visitorsRef = collection(db, 'visitors');
      const q = query(visitorsRef, orderBy('lastVisit', 'desc'), limit(500));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: VisitorRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as any;
            list.push({
              visitorId: data.visitorId || docSnap.id,
              visitCount: data.visitCount || 1,
              firstVisit: data.firstVisit || Date.now(),
              lastVisit: data.lastVisit || Date.now(),
              isReturning: (data.visitCount || 1) > 1,
              referralSource: data.referralSource || 'Direct / Organic',
              deviceType: data.deviceType || 'Mobile',
              countryOrTimezone: data.countryOrTimezone || 'Uganda (EAT)',
              gamesPlayed: data.gamesPlayed || 0,
              gamesCompleted: data.gamesCompleted || 0,
              replaysCount: data.replaysCount || 0,
              ageBracket: data.ageBracket,
              gender: data.gender,
              location: data.location,
            });
          });

          try {
            if (typeof window !== 'undefined' && list.length > 0) {
              localStorage.setItem(LOCAL_VISITORS_KEY, JSON.stringify(list));
            }
          } catch {
            // ignore
          }

          callback(list);
        },
        (error) => {
          console.warn('[Analytics] Firestore visitors subscribe error:', error);
          callback(this.getLocalVisitors());
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn('[Analytics] Firestore init error in subscribeToVisitors:', err);
      callback(this.getLocalVisitors());
      return () => {};
    }
  }

  // =============================================================
  // 5. COMPREHENSIVE BEHAVIOURAL ANALYTICS ENGINE
  // =============================================================

  static getComprehensiveAnalytics(
    sessions: GameSessionRecord[],
    visitors: VisitorRecord[],
    filterEpisodeId?: string
  ) {
    const filteredSessions = sessions.filter((s) => {
      if (filterEpisodeId && filterEpisodeId !== 'all') {
        return s.episodeId === filterEpisodeId || s.episodeNumber === filterEpisodeId;
      }
      return true;
    });

    // -----------------------------------------------------------
    // 1. UNIQUE VISITORS & GAME PLAYERS
    // -----------------------------------------------------------
    // Unique visitors from visitors collection or fallback from sessions
    const uniqueVisitorIds = new Set<string>();
    visitors.forEach((v) => uniqueVisitorIds.add(v.visitorId));
    sessions.forEach((s) => {
      if (s.visitorId) uniqueVisitorIds.add(s.visitorId);
    });

    const uniqueVisitorsCount = uniqueVisitorIds.size;

    // Unique game players (visitors who actually started at least 1 game)
    const gamePlayerIds = new Set<string>();
    sessions.forEach((s) => {
      if (s.visitorId) gamePlayerIds.add(s.visitorId);
    });
    visitors.forEach((v) => {
      if (v.gamesPlayed > 0) gamePlayerIds.add(v.visitorId);
    });

    const gamePlayersCount = gamePlayerIds.size;
    const playerConversionRate =
      uniqueVisitorsCount > 0 ? Math.round((gamePlayersCount / uniqueVisitorsCount) * 100) : 0;

    // -----------------------------------------------------------
    // 2. RETURNING VISITORS & REPEAT PLAYS
    // -----------------------------------------------------------
    const returningVisitorsCount = visitors.filter((v) => v.visitCount > 1).length;
    const newVisitorsCount = Math.max(0, uniqueVisitorsCount - returningVisitorsCount);
    const repeatVisitorRate =
      uniqueVisitorsCount > 0 ? Math.round((returningVisitorsCount / uniqueVisitorsCount) * 100) : 0;

    const totalReplaysCount = filteredSessions.filter((s) => s.isReplay).length;

    // -----------------------------------------------------------
    // 3. NUMBER OF GAMES PLAYED PER VISITOR
    // -----------------------------------------------------------
    const gamesPerVisitorMap: Record<string, number> = {};
    sessions.forEach((s) => {
      const vid = s.visitorId || 'anonymous';
      gamesPerVisitorMap[vid] = (gamesPerVisitorMap[vid] || 0) + 1;
    });

    const totalGamesAcrossAllVisitors = Object.values(gamesPerVisitorMap).reduce((a, b) => a + b, 0);
    const avgGamesPerVisitor =
      gamePlayersCount > 0 ? +(totalGamesAcrossAllVisitors / gamePlayersCount).toFixed(1) : 0;

    const distributionCounts = {
      '1 Game': 0,
      '2–3 Games': 0,
      '4–5 Games': 0,
      '6+ Games': 0,
    };

    Object.values(gamesPerVisitorMap).forEach((count) => {
      if (count === 1) distributionCounts['1 Game'] += 1;
      else if (count <= 3) distributionCounts['2–3 Games'] += 1;
      else if (count <= 5) distributionCounts['4–5 Games'] += 1;
      else distributionCounts['6+ Games'] += 1;
    });

    const gamesPerVisitorDistribution = Object.entries(distributionCounts).map(([label, count]) => ({
      label,
      count,
      percentage: gamePlayersCount > 0 ? Math.round((count / gamePlayersCount) * 100) : 0,
    }));

    // -----------------------------------------------------------
    // 4. NUMBER STARTING AND COMPLETING EACH GAME + MOST/LEAST PLAYED
    // -----------------------------------------------------------
    const episodeStatsMap: Record<
      string,
      {
        id: string;
        number: string;
        title: string;
        startsCount: number;
        completionsCount: number;
        replaysCount: number;
        totalChoicesMade: number;
      }
    > = {};

    sessions.forEach((s) => {
      const epKey = s.episodeId || s.episodeNumber || 'unknown';
      if (!episodeStatsMap[epKey]) {
        episodeStatsMap[epKey] = {
          id: s.episodeId,
          number: s.episodeNumber,
          title: s.episodeTitle || `Episode ${s.episodeNumber}`,
          startsCount: 0,
          completionsCount: 0,
          replaysCount: 0,
          totalChoicesMade: 0,
        };
      }
      episodeStatsMap[epKey].startsCount += 1;
      if (s.completed) {
        episodeStatsMap[epKey].completionsCount += 1;
      }
      if (s.isReplay) {
        episodeStatsMap[epKey].replaysCount += 1;
      }
      episodeStatsMap[epKey].totalChoicesMade += s.choicesCount || 0;
    });

    const episodePerformanceList = Object.values(episodeStatsMap)
      .map((ep) => {
        const completionRate =
          ep.startsCount > 0 ? Math.round((ep.completionsCount / ep.startsCount) * 100) : 0;
        const avgChoices =
          ep.startsCount > 0 ? +(ep.totalChoicesMade / ep.startsCount).toFixed(1) : 0;
        return {
          ...ep,
          completionRate,
          avgChoices,
        };
      })
      .sort((a, b) => b.startsCount - a.startsCount);

    const mostPlayedEpisode = episodePerformanceList[0] || null;
    const leastPlayedEpisode =
      episodePerformanceList.length > 1
        ? episodePerformanceList[episodePerformanceList.length - 1]
        : null;

    // -----------------------------------------------------------
    // 5. WHERE PLAYERS DROP OUT (FUNNEL & BOTTLENECK ANALYSIS)
    // -----------------------------------------------------------
    const totalStarts = filteredSessions.length;
    const reachedFirstChoice = filteredSessions.filter(
      (s) => s.stageReached !== 'opened' || s.choicesCount >= 1 || s.completed
    ).length;
    const reachedMidStory = filteredSessions.filter(
      (s) => s.stageReached === 'mid_story' || s.stageReached === 'climax' || s.stageReached === 'completed' || s.choicesCount >= 2
    ).length;
    const reachedClimax = filteredSessions.filter(
      (s) => s.stageReached === 'climax' || s.stageReached === 'completed'
    ).length;
    const totalCompletions = filteredSessions.filter((s) => s.completed).length;

    const overallCompletionRate = totalStarts > 0 ? Math.round((totalCompletions / totalStarts) * 100) : 0;

    const funnelStages = [
      {
        stage: '1. Story Opened',
        description: 'Landed on episode / intro crossroad',
        count: totalStarts,
        conversionPct: totalStarts > 0 ? 100 : 0,
        dropOffFromPrevPct: 0,
      },
      {
        stage: '2. First Decision Made',
        description: 'Chose first fork in the road',
        count: reachedFirstChoice,
        conversionPct: totalStarts > 0 ? Math.round((reachedFirstChoice / totalStarts) * 100) : 0,
        dropOffFromPrevPct:
          totalStarts > 0 ? Math.round(((totalStarts - reachedFirstChoice) / totalStarts) * 100) : 0,
      },
      {
        stage: '3. Deep Dilemma Explored',
        description: 'Reached mid-story consequences (2+ choices)',
        count: reachedMidStory,
        conversionPct: totalStarts > 0 ? Math.round((reachedMidStory / totalStarts) * 100) : 0,
        dropOffFromPrevPct:
          reachedFirstChoice > 0
            ? Math.round(((reachedFirstChoice - reachedMidStory) / reachedFirstChoice) * 100)
            : 0,
      },
      {
        stage: '4. Reached Climax Dilemma',
        description: 'Crossed threshold into moral crisis point',
        count: reachedClimax,
        conversionPct: totalStarts > 0 ? Math.round((reachedClimax / totalStarts) * 100) : 0,
        dropOffFromPrevPct:
          reachedMidStory > 0
            ? Math.round(((reachedMidStory - reachedClimax) / reachedMidStory) * 100)
            : 0,
      },
      {
        stage: '5. Completed & Voted',
        description: 'Submitted final verdict to Uncle Rwamiti',
        count: totalCompletions,
        conversionPct: overallCompletionRate,
        dropOffFromPrevPct:
          reachedClimax > 0
            ? Math.round(((reachedClimax - totalCompletions) / reachedClimax) * 100)
            : 0,
      },
    ];

    // Specific Drop-Off Bottleneck scenes (where uncompleted games halted)
    const dropOffBottlenecks: Record<string, { title: string; count: number }> = {};
    filteredSessions
      .filter((s) => !s.completed)
      .forEach((s) => {
        const key = s.dropOffNodeTitle || s.dropOffNodeId || 'Intro / Crossroad 1';
        if (!dropOffBottlenecks[key]) {
          dropOffBottlenecks[key] = { title: key, count: 0 };
        }
        dropOffBottlenecks[key].count += 1;
      });

    const dropOffBottlenecksList = Object.values(dropOffBottlenecks)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // -----------------------------------------------------------
    // 6. CHOICES PLAYERS MAKE WITHIN STORIES
    // -----------------------------------------------------------
    const choicesMadeMap: Record<
      string,
      {
        episodeId: string;
        nodeId: string;
        choiceLabel: string;
        count: number;
      }
    > = {};

    filteredSessions.forEach((s) => {
      if (Array.isArray(s.choices)) {
        s.choices.forEach((c) => {
          const key = `${s.episodeId}_${c.nodeId}_${c.choiceLabel}`;
          if (!choicesMadeMap[key]) {
            choicesMadeMap[key] = {
              episodeId: s.episodeId,
              nodeId: c.nodeId,
              choiceLabel: c.choiceLabel,
              count: 0,
            };
          }
          choicesMadeMap[key].count += 1;
        });
      }
    });

    const choicesDistributionList = Object.values(choicesMadeMap).sort((a, b) => b.count - a.count);

    // -----------------------------------------------------------
    // 7. SHARES & REFERRAL SOURCES
    // -----------------------------------------------------------
    const referralCounts: Record<string, number> = {
      'WhatsApp Challenge Link': 0,
      'Direct / Organic': 0,
      'Friend Challenge Link': 0,
      'Episode Deep-Link': 0,
      'Social Media / External': 0,
    };

    // Combine referrals from visitors and sessions
    const countedSources = new Set<string>();
    visitors.forEach((v) => {
      const src = v.referralSource || 'Direct / Organic';
      if (src.includes('WhatsApp')) referralCounts['WhatsApp Challenge Link'] += 1;
      else if (src.includes('Friend') || src.includes('challenge')) referralCounts['Friend Challenge Link'] += 1;
      else if (src.includes('Deep-Link')) referralCounts['Episode Deep-Link'] += 1;
      else if (src.includes('Direct') || src.includes('Organic')) referralCounts['Direct / Organic'] += 1;
      else {
        referralCounts['Social Media / External'] = (referralCounts['Social Media / External'] || 0) + 1;
      }
      countedSources.add(v.visitorId);
    });

    // In-app share button clicks from Analytics Events
    const rawEvents = this.getEvents();
    const inAppShareClicks = rawEvents.filter(
      (e) => e.eventName === 'challenge_friend_clicked'
    ).length;

    const referralDistribution = Object.entries(referralCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: uniqueVisitorsCount > 0 ? Math.round((count / uniqueVisitorsCount) * 100) : 0,
      }))
      .filter((r) => r.count > 0 || uniqueVisitorsCount === 0)
      .sort((a, b) => b.count - a.count);

    // -----------------------------------------------------------
    // 8. DEVICE TYPE, COUNTRY, LOCATION, AGE & GENDER
    // -----------------------------------------------------------
    const deviceCounts: Record<string, number> = {
      Mobile: 0,
      Tablet: 0,
      Desktop: 0,
    };

    const ageCounts: Record<string, number> = {};
    AGE_BRACKETS.forEach((b) => (ageCounts[b] = 0));
    ageCounts['Undisclosed'] = 0;

    const genderCounts: Record<string, number> = {
      Female: 0,
      Male: 0,
      Other: 0,
      'Prefer not to say': 0,
    };

    const locationCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};

    filteredSessions.forEach((s) => {
      // Device
      const dev = s.deviceType || 'Mobile';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;

      // Age
      const age = s.ageBracket || 'Undisclosed';
      ageCounts[age] = (ageCounts[age] || 0) + 1;

      // Gender
      const g = s.gender || 'Prefer not to say';
      genderCounts[g] = (genderCounts[g] || 0) + 1;

      // District / Location
      let loc = s.location || 'Undisclosed';
      if (loc.includes('Kampala')) loc = 'Kampala';
      else if (loc.includes('Wakiso')) loc = 'Wakiso';
      else if (loc.includes('Mukono')) loc = 'Mukono';
      else if (loc.includes('Jinja')) loc = 'Jinja';
      else if (loc.includes('Mbarara')) loc = 'Mbarara';
      else if (loc.includes('Gulu')) loc = 'Gulu';
      else if (loc.includes('Arua')) loc = 'Arua';
      else if (loc.includes('Masaka')) loc = 'Masaka';
      else if (loc.includes('Mbale')) loc = 'Mbale';
      else if (loc.includes('Diaspora')) loc = 'Diaspora';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;

      // Country / Timezone
      const c = s.countryOrTimezone || 'Uganda (EAT)';
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalStarts > 0 ? Math.round((count / totalStarts) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const ageDistribution = Object.entries(ageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalStarts > 0 ? Math.round((count / totalStarts) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const genderDistribution = Object.entries(genderCounts).map(([name, count]) => ({
      name,
      count,
      percentage: totalStarts > 0 ? Math.round((count / totalStarts) * 100) : 0,
    }));

    const topCountriesOrTimezones = Object.entries(countryCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalStarts > 0 ? Math.round((count / totalStarts) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      // 1. Visitors & Players
      uniqueVisitorsCount,
      gamePlayersCount,
      playerConversionRate,
      newVisitorsCount,
      returningVisitorsCount,
      repeatVisitorRate,
      avgGamesPerVisitor,
      gamesPerVisitorDistribution,

      // 2. Games Starts & Completions
      totalStarts,
      totalCompletions,
      overallCompletionRate,
      totalReplaysCount,
      episodePerformanceList,
      mostPlayedEpisode,
      leastPlayedEpisode,

      // 3. Drop-off Funnel
      funnelStages,
      dropOffBottlenecksList,

      // 4. Choices Made
      choicesDistributionList,

      // 5. Shares & Referrals
      referralDistribution,
      inAppShareClicks,

      // 6. Demographics & Devices
      deviceCounts,
      topLocations,
      ageDistribution,
      genderDistribution,
      topCountriesOrTimezones,

      // Live recent log
      recentSessions: filteredSessions.slice(0, 100),
    };
  }

  // Backward compatibility alias for existing calls
  static getDemographicSummary(sessions: GameSessionRecord[], filterEpisodeId?: string) {
    const full = this.getComprehensiveAnalytics(sessions, this.getLocalVisitors(), filterEpisodeId);
    return {
      totalSessions: full.totalStarts,
      completedCount: full.totalCompletions,
      completionRate: full.overallCompletionRate,
      topLocations: full.topLocations,
      ageDistribution: full.ageDistribution,
      genderDistribution: full.genderDistribution,
      deviceCounts: full.deviceCounts,
      recentSessions: full.recentSessions,
      ...full,
    };
  }

  // =============================================================
  // 6. RAW EVENT TRACKING & CSV EXPORT
  // =============================================================

  static getEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  static track(
    eventName: AnalyticsEvent['eventName'] | 'demographics_updated',
    payload?: {
      episodeId?: string;
      nodeId?: string;
      choiceId?: string;
      choiceLabel?: string;
      metadata?: Record<string, any>;
    }
  ): void {
    if (typeof window === 'undefined') return;
    try {
      const events = this.getEvents();
      const demo = this.getPlayerDemographics();
      const newEvent: AnalyticsEvent = {
        id: 'evt_' + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        eventName: eventName as any,
        episodeId: payload?.episodeId,
        nodeId: payload?.nodeId,
        choiceId: payload?.choiceId,
        choiceLabel: payload?.choiceLabel,
        metadata: {
          ...payload?.metadata,
          ageBracket: demo.ageBracket,
          gender: demo.gender,
          location: demo.location,
        },
      };
      events.push(newEvent);
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-1000)));
    } catch (e) {
      console.error('Failed to log analytics event:', e);
    }
  }

  static recordStoryStarted(episodeId: string, episodeTitle?: string): void {
    this.startRealGameSession({
      episodeId,
      episodeNumber: '01',
      episodeTitle: episodeTitle || episodeId,
      isReplay: false,
    }).catch(() => {});
    this.track('story_started', { episodeId });
  }

  static recordChoiceSelected(
    episodeId: string,
    nodeId: string,
    choiceLabel: string,
    choiceId?: string,
    totalChoicesMade: number = 1
  ): void {
    this.updateRealGameSessionChoice({
      choiceId: choiceId || nodeId,
      choiceLabel,
      nodeId,
      totalChoicesMade,
    }).catch(() => {});
    this.track('choice_selected', {
      episodeId,
      nodeId,
      choiceId: choiceId || nodeId,
      choiceLabel,
    });
  }

  static recordStoryCompleted(
    episodeId: string,
    endingNodeId?: string,
    episodeTitle?: string,
    choicesCount: number = 2
  ): void {
    this.completeRealGameSession({
      episodeId,
      episodeNumber: '01',
      episodeTitle: episodeTitle || episodeId,
      choicesCount,
      pollOption: endingNodeId,
    }).catch(() => {});
    this.track('story_completed', { episodeId, nodeId: endingNodeId });
  }


  static recordReplayClicked(episodeId: string): void {
    this.track('replay_clicked', { episodeId });
  }


  static exportDemographicsCSV(sessions: GameSessionRecord[]): string {
    const headers = [
      'Session_ID',
      'Visitor_ID',
      'Date_Time',
      'Episode_Number',
      'Episode_Title',
      'Stage_Reached',
      'Completed',
      'Decisions_Made',
      'Final_Poll_Vote',
      'Age_Bracket',
      'Gender',
      'District_Location',
      'Device_Type',
      'Referral_Source',
      'Timezone_Region',
    ];

    const rows = sessions.map((s) => [
      s.id,
      s.visitorId || 'N/A',
      `"${s.dateStr}"`,
      s.episodeNumber,
      `"${(s.episodeTitle || '').replace(/"/g, '""')}"`,
      s.stageReached || (s.completed ? 'completed' : 'opened'),
      s.completed ? 'YES' : 'NO',
      s.choicesCount,
      `"${(s.pollOption || '').replace(/"/g, '""')}"`,
      `"${s.ageBracket || 'Undisclosed'}"`,
      `"${s.gender || 'Prefer not to say'}"`,
      `"${(s.location || 'Undisclosed').replace(/"/g, '""')}"`,
      s.deviceType,
      `"${s.referralSource || 'Direct / Organic'}"`,
      `"${s.countryOrTimezone || 'Uganda'}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static exportRawEventsCSV(): string {
    const events = this.getEvents();
    const headers = ['Event_ID', 'Timestamp', 'Date_Time', 'Event_Name', 'Episode_ID', 'Node_ID', 'Choice_ID', 'Choice_Label'];
    const rows = events.map((e) => [
      e.id,
      e.timestamp,
      `"${new Date(e.timestamp).toISOString()}"`,
      e.eventName,
      e.episodeId || '',
      e.nodeId || '',
      e.choiceId || '',
      `"${(e.choiceLabel || '').replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static exportCSV(): string {
    return this.exportRawEventsCSV();
  }

  static clearAnalytics(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ANALYTICS_KEY);
    localStorage.removeItem(LOCAL_SESSIONS_KEY);
    localStorage.removeItem(LOCAL_VISITORS_KEY);
    localStorage.removeItem('rwamiti_real_events_v3');
    localStorage.removeItem('rwamiti_real_sessions_v3');
    localStorage.removeItem('rwamiti_analytics_events_v1');
    localStorage.removeItem('rwamiti_analytics_events_v2');
  }
}
