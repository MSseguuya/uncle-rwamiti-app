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
import storyDb from '../data/storyDatabase.json';
import { ALL_INCORPORATED_EPISODES } from '../data/allGamesDatabase';
import { getStoredComics } from '../data/comicsData';

const ANALYTICS_KEY = 'rwamiti_real_events_v4';
const DEMOGRAPHICS_KEY = 'rwamiti_real_demographics_v4';
const VISITOR_KEY = 'rwamiti_real_visitor_v4';
const LOCAL_SESSIONS_KEY = 'rwamiti_real_sessions_v4';
const LOCAL_VISITORS_KEY = 'rwamiti_real_visitors_list_v4';
const FLAGGED_TEST_VISITORS_KEY = 'rwamiti_flagged_test_visitors_v1';

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

// Confirmed test visitor accounts from verification audit
export const KNOWN_TEST_VISITOR_IDS = new Set<string>([
  'vid_muxwl849_dh37ltr',
  'vid_muvn5sny_rj0nalz',
  'server_visitor',
]);

// =============================================================
// CANONICAL STORY IDENTIFIERS & METADATA RESOLUTION
// =============================================================

export interface CanonicalStoryInfo {
  canonicalId: string;
  episodeNumber: string;
  episodeTitle: string;
  storyIdentifier: string;
  category: string;
}

/**
 * Resolves any slug, legacy episode id or number into consistent, readable story metadata.
 * Ensures stories are not erroneously numbered "01".
 */
export function getCanonicalStoryInfo(
  episodeIdOrSlug: string,
  fallbackNumber?: string,
  fallbackTitle?: string
): CanonicalStoryInfo {
  const clean = (episodeIdOrSlug || '').trim().toLowerCase();
  const rawCatalog = (storyDb.catalog || []) as any[];

  // 1. Match from 38 platform catalog stories
  const catIdx = rawCatalog.findIndex(
    (s) => s.slug.toLowerCase() === clean || s.title.toLowerCase() === clean
  );
  if (catIdx !== -1) {
    const s = rawCatalog[catIdx];
    const num = String(catIdx + 1).padStart(3, '0');
    return {
      canonicalId: s.slug,
      episodeNumber: num,
      episodeTitle: s.title,
      storyIdentifier: `EP ${num} · ${s.title}`,
      category: s.category || (catIdx < 14 ? 'Teen Stories' : 'Adult Stories'),
    };
  }

  // 2. Match from ALL_INCORPORATED_EPISODES (Kampala dilemmas etc.)
  const incMatch = ALL_INCORPORATED_EPISODES.find(
    (e) =>
      e.id.toLowerCase() === clean ||
      e.number === fallbackNumber ||
      e.title.toLowerCase() === clean
  );
  if (incMatch) {
    const num = incMatch.number.padStart(3, '0');
    return {
      canonicalId: incMatch.id,
      episodeNumber: num,
      episodeTitle: incMatch.title,
      storyIdentifier: `EP ${num} · ${incMatch.title}`,
      category: incMatch.category || 'Kampala Dilemmas',
    };
  }

  // 3. Match from Comics collection
  const comicList = getStoredComics();
  const comicMatch = comicList.find(
    (c) =>
      c.slug.toLowerCase() === clean ||
      c.id.toLowerCase() === clean ||
      c.title.toLowerCase() === clean ||
      c.issueNumber === fallbackNumber
  );
  if (comicMatch) {
    const num = comicMatch.issueNumber.padStart(3, '0');
    return {
      canonicalId: comicMatch.slug,
      episodeNumber: num,
      episodeTitle: comicMatch.title,
      storyIdentifier: `COMIC #${num} · ${comicMatch.title}`,
      category: 'Comics',
    };
  }

  // 4. Fallback with cleaned readable title and number
  const isComicLike = clean.startsWith('comic-') || clean.includes('comic');
  const title =
    fallbackTitle && fallbackTitle !== '01'
      ? fallbackTitle
      : clean
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Untitled Story';
  const num =
    fallbackNumber && fallbackNumber !== '01'
      ? fallbackNumber.padStart(3, '0')
      : '001';

  return {
    canonicalId: clean || 'unknown',
    episodeNumber: num,
    episodeTitle: title,
    storyIdentifier: `${isComicLike ? 'COMIC' : 'EP'} ${num} · ${title}`,
    category: isComicLike ? 'Comics' : 'Stories',
  };
}

// =============================================================
// TIME & DATE FORMATTING IN UGANDA TIME (EAT · UTC+3)
// =============================================================

export function formatUgandaDateTime(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  try {
    return (
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Kampala',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(date) + ' EAT'
    );
  } catch {
    return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }
}

// =============================================================
// READABLE CHOICE & POLL RESOLUTION
// =============================================================

/**
 * Resolves raw choice identifiers (such as "09" or node keys) into consistent,
 * human-readable decision labels from the story database.
 */
export function resolveReadableChoiceLabel(
  episodeId: string,
  nodeId?: string,
  rawChoice?: string
): string {
  const clean = (rawChoice || '').trim();
  if (!clean || clean === 'OPTIONS' || clean === '09' || clean === 'node-09') {
    if (clean === '09' || clean === 'node-09') {
      return 'Eleven Years Ago (Confronting 11 Years of Secret History)';
    }
  }

  if (episodeId === 'the-secret-account' && (clean === '09' || nodeId === '08a')) {
    if (clean === '09') return 'Eleven Years Ago (Confronting 11 Years of Secret History)';
  }

  if (clean === 'node-start' || clean === 'opening' || clean === 'start') {
    return 'Opening Crossroad Decision';
  }

  // Look up in storyDatabase
  const rawCatalog = (storyDb.stories || {}) as Record<string, any>;
  const story = rawCatalog[episodeId];
  if (story && story.nodes) {
    if (nodeId && story.nodes[nodeId]?.choices) {
      const matchChoice = story.nodes[nodeId].choices.find(
        (c: any) => c.to === clean || c.target === clean || c.label === clean
      );
      if (matchChoice?.label) return matchChoice.label;
    }
    if (story.nodes[clean]) {
      return story.nodes[clean].title || `Scene: ${clean}`;
    }
  }

  // Look up in ALL_INCORPORATED_EPISODES
  const inc = ALL_INCORPORATED_EPISODES.find((e) => e.id === episodeId);
  if (inc) {
    if (nodeId && inc.nodes[nodeId]?.choices) {
      const match = inc.nodes[nodeId].choices.find(
        (c: any) => c.id === clean || c.label === clean || c.targetNodeId === clean
      );
      if (match?.label) return match.label;
    }
    if (inc.nodes[clean]) {
      return (inc.nodes[clean] as any)?.situation?.title || (inc.nodes[clean] as any)?.title || `Scene: ${clean}`;
    }
  }

  return clean || 'Narrative Continuation';
}

/**
 * Resolves Uncle Rwamiti reflection poll votes to ensure clarity vs story choices.
 * (e.g. "OPTIONS" on Episode 001: 2% Battery poll -> "OPTIONS (Ep 001 Reflection Poll)").
 */
export function resolveReadablePollVote(
  episodeId: string,
  pollVote?: string
): string {
  const clean = (pollVote || '').trim();
  if (
    !clean ||
    clean === 'ending-good' ||
    clean === 'ending-bad' ||
    clean === 'None / Skipped' ||
    clean === 'None'
  ) {
    return 'None / Not Polled';
  }

  if (episodeId === 'ep-001' || episodeId === '039') {
    if (['POWER', 'OPTIONS', 'TRUST', 'TIME'].includes(clean)) {
      return `${clean} (Ep 001 Reflection Poll)`;
    }
  }

  return clean;
}

// =============================================================
// TEST ACTIVITY DETECTION & HEURISTICS
// =============================================================

export function isTestSessionRecord(
  session: GameSessionRecord,
  allVisitorSessions?: GameSessionRecord[],
  adminFlaggedVisitors?: Set<string>
): { isTest: boolean; reason: string } {
  // 1. Admin-flagged visitor
  if (adminFlaggedVisitors && adminFlaggedVisitors.has(session.visitorId)) {
    return { isTest: true, reason: 'Admin-Flagged Test Account' };
  }

  // 2. Confirmed test account from verification audit
  if (KNOWN_TEST_VISITOR_IDS.has(session.visitorId)) {
    return {
      isTest: true,
      reason: 'Confirmed Test Account (developer automated sequence)',
    };
  }

  // 3. Explicitly recorded flag
  if (session.isTest) {
    return {
      isTest: true,
      reason: session.testFlagReason || 'Marked as Test Activity',
    };
  }

  // 4. Multi-story rapid completion burst:
  // Fast completion ALONE on one story is NOT classified as testing.
  // Only flag if visitor completed >=3 distinct stories with <10s intervals between them.
  if (allVisitorSessions && allVisitorSessions.length >= 3) {
    const sorted = [...allVisitorSessions].sort((a, b) => a.timestamp - b.timestamp);
    let rapidSequences = 0;
    for (let i = 1; i < sorted.length; i++) {
      const diffSec = (sorted[i].timestamp - sorted[i - 1].timestamp) / 1000;
      if (
        diffSec > 0 &&
        diffSec < 10 &&
        sorted[i].episodeId !== sorted[i - 1].episodeId &&
        sorted[i].completed &&
        sorted[i - 1].completed
      ) {
        rapidSequences++;
      }
    }
    if (rapidSequences >= 2) {
      return {
        isTest: true,
        reason: 'Automated Rapid Sequence (<10s across multiple stories)',
      };
    }
  }

  return { isTest: false, reason: 'Real Audience Activity' };
}

// =============================================================
// STORY ATTEMPT DEDUPLICATION ENGINE
// =============================================================

/**
 * Deduplicates raw session documents into distinct, identifiable story attempts.
 * Prevents page reloads, tab refreshes, or duplicate submissions from inflating counts.
 * Ensures opening, progress, and completion belong to ONE identifiable story attempt.
 */
export function deduplicateGameSessions(rawSessions: GameSessionRecord[]): GameSessionRecord[] {
  if (!rawSessions || rawSessions.length === 0) return [];

  // Group by visitorId + canonical episodeId
  const groups: Record<string, GameSessionRecord[]> = {};
  rawSessions.forEach((s) => {
    const canonical = getCanonicalStoryInfo(s.episodeId, s.episodeNumber, s.episodeTitle);
    const key = `${s.visitorId || 'anon'}_${canonical.canonicalId}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push({
      ...s,
      episodeId: canonical.canonicalId,
      episodeNumber: canonical.episodeNumber,
      episodeTitle: canonical.episodeTitle,
      storyIdentifier: canonical.storyIdentifier,
    });
  });

  const deduplicated: GameSessionRecord[] = [];

  for (const group of Object.values(groups)) {
    if (group.length === 1) {
      deduplicated.push(group[0]);
      continue;
    }

    // Sort chronologically ascending
    group.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    let currentAttempt: GameSessionRecord | null = null;
    let attemptLastActivityMs = 0;

    for (const session of group) {
      if (!currentAttempt) {
        currentAttempt = { ...session };
        attemptLastActivityMs = session.timestamp || 0;
        continue;
      }

      const timeDiffFromLastActivitySec = Math.max(0, (session.timestamp - attemptLastActivityMs) / 1000);
      const isIdenticalTimestamp = Math.abs(session.timestamp - currentAttempt.timestamp) < 5000;

      // Belong to the SAME identifiable attempt if:
      // 1. Identical or near-identical timestamp (duplicate submission or concurrent doc creation)
      // 2. OR within 30 minutes (1800s) of active progression without an explicit replay trigger
      const isSameAttempt = (isIdenticalTimestamp || timeDiffFromLastActivitySec <= 1800) && !session.isReplay;

      if (isSameAttempt) {
        // Merge progress into the single attempt
        const mergedChoices =
          session.choices && session.choices.length > 0
            ? (currentAttempt.choices && currentAttempt.choices.length > session.choices.length
                ? currentAttempt.choices
                : session.choices)
            : (currentAttempt.choices || []);

        const isCompleted = currentAttempt.completed || session.completed;
        const finalChoice = session.finalStoryChoice || currentAttempt.finalStoryChoice;
        const pollVote = session.pollOption || currentAttempt.pollOption;

        const maxChoices = Math.max(
          currentAttempt.choicesCount || 0,
          session.choicesCount || 0,
          mergedChoices.length
        );

        let stage = currentAttempt.stageReached;
        if (isCompleted) {
          stage = 'completed';
        } else if (session.stageReached === 'climax' || currentAttempt.stageReached === 'climax') {
          stage = 'climax';
        } else if (session.stageReached === 'mid_story' || currentAttempt.stageReached === 'mid_story' || maxChoices > 1) {
          stage = 'mid_story';
        } else if (maxChoices >= 1 || session.stageReached === 'first_choice') {
          stage = 'first_choice';
        }

        const activePlaySec = Math.max(
          currentAttempt.activePlayTimeSeconds || 0,
          session.activePlayTimeSeconds || 0,
          Math.min(3600, Math.round((session.timestamp - currentAttempt.timestamp) / 1000))
        );

        currentAttempt = {
          ...currentAttempt,
          // Preserve the original attempt initiation timestamp
          timestamp: Math.min(currentAttempt.timestamp, session.timestamp),
          completed: isCompleted,
          stageReached: stage,
          choices: mergedChoices,
          choicesCount: maxChoices,
          finalStoryChoice: finalChoice,
          pollOption: pollVote,
          activePlayTimeSeconds: activePlaySec,
          dropOffNodeId: isCompleted ? 'completed' : (session.dropOffNodeId || currentAttempt.dropOffNodeId),
          dropOffNodeTitle: isCompleted ? (session.endingReachedTitle || 'Story Complete') : (session.dropOffNodeTitle || currentAttempt.dropOffNodeTitle),
          endingReachedTitle: isCompleted ? (session.endingReachedTitle || currentAttempt.endingReachedTitle || 'Story Complete') : undefined,
          // Merge demographics if present
          ageBracket: session.ageBracket && session.ageBracket !== 'Undisclosed' ? session.ageBracket : currentAttempt.ageBracket,
          gender: session.gender && session.gender !== 'Prefer not to say' ? session.gender : currentAttempt.gender,
          location: session.location && session.location !== 'Undisclosed' ? session.location : currentAttempt.location,
          referralSource: currentAttempt.referralSource || session.referralSource,
          referralChannel: currentAttempt.referralChannel || session.referralChannel,
        };

        attemptLastActivityMs = Math.max(attemptLastActivityMs, session.timestamp || 0);
      } else {
        // Distinct attempt (deliberate replay or returning after >30m)
        deduplicated.push(currentAttempt);
        currentAttempt = { ...session };
        attemptLastActivityMs = session.timestamp || 0;
      }
    }

    if (currentAttempt) {
      deduplicated.push(currentAttempt);
    }
  }

  return deduplicated.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

// =============================================================
// MAIN ANALYTICS SERVICE CLASS
// =============================================================

export class AnalyticsService {
  private static currentActiveDocId: string | null = null;
  private static currentEpisodeId: string | null = null;
  private static currentEpisodeChoices: GameSessionChoice[] = [];
  private static activeAttemptStartMs: number = Date.now();

  // -------------------------------------------------------------
  // 1. VISITOR IDENTIFIER
  // -------------------------------------------------------------

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

  // -------------------------------------------------------------
  // 2. REFERRAL & PROMOTIONAL LINK DETECTION
  // -------------------------------------------------------------

  static detectReferralDetails(): { source: string; channel: string; medium: string } {
    if (typeof window === 'undefined') {
      return { source: 'Direct / Unknown Traffic', channel: 'Direct / Unknown', medium: 'none' };
    }

    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const ref = (params.get('ref') || params.get('source') || params.get('utm_source') || '').toLowerCase();
      const medium = (params.get('utm_medium') || '').toLowerCase();
      const campaign = params.get('utm_campaign') || '';

      // 1. Tagged promotional & campaign links
      if (ref.includes('whatsapp') || ref === 'wa') {
        return { source: 'WhatsApp Promotional Link', channel: 'WhatsApp', medium: medium || 'social_share' };
      }
      if (ref.includes('linkedin') || ref === 'li') {
        return { source: 'LinkedIn Promotional Link', channel: 'LinkedIn', medium: medium || 'social' };
      }
      if (ref.includes('facebook') || ref === 'fb') {
        return { source: 'Facebook Promotional Link', channel: 'Facebook', medium: medium || 'social' };
      }
      if (ref.includes('workvivo')) {
        return { source: 'Workvivo Promotional Link', channel: 'Workvivo', medium: medium || 'internal_comm' };
      }
      if (ref.includes('challenge')) {
        return { source: 'Friend Challenge Link', channel: 'Challenge', medium: 'peer_share' };
      }
      if (ref.includes('twitter') || ref === 'x') {
        return { source: 'X / Twitter Promotional Link', channel: 'X / Twitter', medium: medium || 'social' };
      }
      if (ref) {
        return {
          source: `Campaign: ${ref}${campaign ? ' (' + campaign + ')' : ''}`,
          channel: ref.toUpperCase(),
          medium: medium || 'campaign',
        };
      }

      // 2. HTTP Referrer domain classification
      if (document.referrer) {
        const refUrl = new URL(document.referrer);
        const host = refUrl.hostname.toLowerCase();

        // Search Engines (Organic)
        if (host.includes('google.')) return { source: 'Google Search (Organic)', channel: 'Search (Google)', medium: 'organic' };
        if (host.includes('bing.')) return { source: 'Bing Search (Organic)', channel: 'Search (Bing)', medium: 'organic' };
        if (host.includes('yahoo.')) return { source: 'Yahoo Search (Organic)', channel: 'Search (Yahoo)', medium: 'organic' };
        if (host.includes('duckduckgo.')) return { source: 'DuckDuckGo (Organic)', channel: 'Search (DuckDuckGo)', medium: 'organic' };
        if (host.includes('ecosia.')) return { source: 'Ecosia Search (Organic)', channel: 'Search (Ecosia)', medium: 'organic' };

        // Social Platforms
        if (host.includes('whatsapp') || host.includes('api.whatsapp.com')) {
          return { source: 'WhatsApp Web / Mobile Referrer', channel: 'WhatsApp', medium: 'chat' };
        }
        if (host.includes('linkedin.com') || host.includes('lnkd.in')) {
          return { source: 'LinkedIn Referrer', channel: 'LinkedIn', medium: 'social' };
        }
        if (host.includes('facebook.com') || host.includes('fb.com') || host.includes('m.facebook.com')) {
          return { source: 'Facebook Referrer', channel: 'Facebook', medium: 'social' };
        }
        if (host.includes('workvivo.com')) {
          return { source: 'Workvivo Referrer', channel: 'Workvivo', medium: 'internal_comm' };
        }
        if (host.includes('t.co') || host.includes('twitter.com') || host.includes('x.com')) {
          return { source: 'X / Twitter Referrer', channel: 'X / Twitter', medium: 'social' };
        }
        if (host.includes('instagram.com')) {
          return { source: 'Instagram Referrer', channel: 'Instagram', medium: 'social' };
        }
        if (host.includes('tiktok.com')) {
          return { source: 'TikTok Referrer', channel: 'TikTok', medium: 'social' };
        }
        if (host.includes('peterospaths.org')) {
          return { source: 'PeterosPaths.org Referral', channel: 'PeterosPaths', medium: 'partner_site' };
        }

        if (host && host !== window.location.hostname) {
          return { source: `Referral: ${host}`, channel: host, medium: 'referral' };
        }
      }
    } catch {
      // ignore
    }

    return { source: 'Direct / Unknown Traffic', channel: 'Direct / Unknown', medium: 'none' };
  }

  static detectReferralSource(): string {
    return this.detectReferralDetails().source;
  }

  // -------------------------------------------------------------
  // 3. SYSTEM TIMEZONE & VERIFIED LOCATION
  // -------------------------------------------------------------

  static detectBrowserTimezone(): string {
    if (typeof window === 'undefined') return 'Africa/Kampala';
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Kampala';
    } catch {
      return 'Africa/Kampala';
    }
  }

  static formatLocationAndSystemTimezone(
    location?: string,
    rawTz?: string
  ): {
    verifiedLocation: string;
    systemTimezone: string;
    displayLocation: string;
  } {
    const browserTz = rawTz || this.detectBrowserTimezone();
    const hasUserLocation = location && location !== 'Undisclosed' && location.trim().length > 0;

    if (hasUserLocation) {
      return {
        verifiedLocation: location,
        systemTimezone: browserTz,
        displayLocation: `User-Reported: ${location}`,
      };
    }

    return {
      verifiedLocation: 'Undisclosed by Visitor',
      systemTimezone: browserTz,
      displayLocation: `Undisclosed (Browser TZ: ${browserTz})`,
    };
  }

  static detectCountryOrTimezone(): string {
    const tz = this.detectBrowserTimezone();
    return `Browser System TZ: ${tz}`;
  }

  static detectDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
    if (typeof window === 'undefined') return 'Mobile';
    const ua = navigator.userAgent.toLowerCase();
    if (
      /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        ua
      )
    ) {
      return 'Tablet';
    }
    if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/.test(ua)) {
      return 'Mobile';
    }
    return window.innerWidth < 768 ? 'Mobile' : 'Desktop';
  }

  // -------------------------------------------------------------
  // 4. VISITOR ONBOARDING & VISIT RECORDING
  // -------------------------------------------------------------

  static async recordVisitorVisit(): Promise<VisitorRecord> {
    const visitorId = this.getOrCreateVisitorId();
    const demo = this.getPlayerDemographics();
    const deviceType = this.detectDeviceType();
    const ref = this.detectReferralDetails();
    const tz = this.detectBrowserTimezone();
    const now = Date.now();

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
      referralSource: isNew ? ref.source : localVisitor?.referralSource || ref.source,
      deviceType,
      countryOrTimezone: `Browser System TZ: ${tz}`,
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
      await setDoc(
        visitorRef,
        {
          ...record,
          lastSeenAt: new Date(now).toISOString(),
          firstSeenAt: new Date(firstVisit).toISOString(),
          dateUganda: formatUgandaDateTime(now),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('[Analytics] Could not write visitor to Firestore:', err);
    }

    return record;
  }

  // -------------------------------------------------------------
  // 5. DEMOGRAPHICS MANAGEMENT
  // -------------------------------------------------------------

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
    } catch {
      // ignore
    }
    return {
      ageBracket: 'Undisclosed',
      gender: 'Prefer not to say',
      location: 'Undisclosed',
      hasSubmitted: false,
    };
  }

  static savePlayerDemographics(demo: Partial<PlayerDemographics>): PlayerDemographics {
    const current = this.getPlayerDemographics();
    const updated: PlayerDemographics = {
      ...current,
      ...demo,
      hasSubmitted: true,
    };
    try {
      localStorage.setItem(DEMOGRAPHICS_KEY, JSON.stringify(updated));
      const visitorId = this.getOrCreateVisitorId();
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
  }

  // -------------------------------------------------------------
  // 6. REAL GAMEPLAY ATTEMPT LIFECYCLE (START -> CHOICE -> COMPLETE)
  // -------------------------------------------------------------

  /**
   * Starts a real story play attempt with attempt idempotency.
   * If an attempt for this story is already active in sessionStorage (e.g. from page refresh),
   * reuses the existing session to prevent duplicate counting.
   */
  static async startRealGameSession(data: {
    episodeId: string;
    episodeNumber?: string;
    episodeTitle?: string;
    isReplay?: boolean;
    initialNodeId?: string;
    initialNodeTitle?: string;
  }): Promise<string | null> {
    const canonical = getCanonicalStoryInfo(data.episodeId, data.episodeNumber, data.episodeTitle);
    const visitorId = this.getOrCreateVisitorId();
    const demo = this.getPlayerDemographics();
    const deviceType = this.detectDeviceType();
    const ref = this.detectReferralDetails();
    const tz = this.detectBrowserTimezone();
    const timestamp = Date.now();
    const dateUganda = formatUgandaDateTime(timestamp);

    this.currentEpisodeId = canonical.canonicalId;
    this.currentEpisodeChoices = [];
    this.activeAttemptStartMs = timestamp;

    const attemptStorageKey = `rwamiti_active_attempt_${canonical.canonicalId}`;

    // Unless deliberate replay, check if an attempt was already initiated in this session
    if (!data.isReplay && typeof window !== 'undefined') {
      try {
        const storedAttemptJson = sessionStorage.getItem(attemptStorageKey);
        if (storedAttemptJson) {
          const storedAttempt = JSON.parse(storedAttemptJson);
          const ageSec = (Date.now() - (storedAttempt.timestamp || 0)) / 1000;
          if (ageSec < 1800 && storedAttempt.docId) {
            this.currentActiveDocId = storedAttempt.docId;
            return storedAttempt.docId;
          }
        }
      } catch {
        // ignore
      }
    }

    const testClassification = isTestSessionRecord(
      {
        id: '',
        visitorId,
        timestamp,
        dateStr: dateUganda,
        episodeId: canonical.canonicalId,
        episodeNumber: canonical.episodeNumber,
        episodeTitle: canonical.episodeTitle,
        ageBracket: demo.ageBracket || 'Undisclosed',
        gender: demo.gender || 'Prefer not to say',
        location: demo.location || 'Undisclosed',
        deviceType,
        stageReached: 'opened',
        choices: [],
        choicesCount: 0,
        completed: false,
        isReplay: !!data.isReplay,
        referralSource: ref.source,
        countryOrTimezone: `Browser System TZ: ${tz}`,
      },
      undefined,
      this.getFlaggedTestVisitors()
    );

    const sessionPayload: Omit<GameSessionRecord, 'id'> = {
      visitorId,
      timestamp,
      dateStr: dateUganda,
      dateUganda,
      dateIso: new Date(timestamp).toISOString(),
      episodeId: canonical.canonicalId,
      episodeNumber: canonical.episodeNumber,
      episodeTitle: canonical.episodeTitle,
      storyIdentifier: canonical.storyIdentifier,
      ageBracket: demo.ageBracket || 'Undisclosed',
      gender: demo.gender || 'Prefer not to say',
      location: demo.location || 'Undisclosed',
      deviceType,
      stageReached: 'opened',
      dropOffNodeId: data.initialNodeId || 'opening',
      dropOffNodeTitle: data.initialNodeTitle || 'Story Intro / Crossroad 1',
      choices: [],
      choicesCount: 0,
      completed: false,
      isReplay: !!data.isReplay,
      referralSource: ref.source,
      referralChannel: ref.channel,
      referralMedium: ref.medium,
      countryOrTimezone: `Browser System TZ: ${tz}`,
      activePlayTimeSeconds: 0,
      isTest: testClassification.isTest,
      testFlagReason: testClassification.reason,
    };

    // Increment visitor's gamesPlayed counter in Firestore
    try {
      const db = getDb();
      const visitorRef = doc(db, 'visitors', visitorId);
      updateDoc(visitorRef, {
        gamesPlayed: increment(1),
        replaysCount: data.isReplay ? increment(1) : increment(0),
        lastPlayedEpisodeId: canonical.canonicalId,
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

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          attemptStorageKey,
          JSON.stringify({ docId: docRef.id, timestamp })
        );
      }
      return docRef.id;
    } catch (err) {
      console.warn('[Analytics] Could not write session to Firestore (caching locally):', err);
      const fallbackId = 'local_' + Math.random().toString(36).substring(2, 9);
      this.currentActiveDocId = fallbackId;
      this.saveLocalSession({
        id: fallbackId,
        ...sessionPayload,
      });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          attemptStorageKey,
          JSON.stringify({ docId: fallbackId, timestamp })
        );
      }
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
    activeTimeSeconds?: number;
  }): Promise<void> {
    const choiceItem: GameSessionChoice = {
      nodeId: data.nodeId,
      choiceId: data.choiceId,
      choiceLabel: data.choiceLabel,
      timestamp: Date.now(),
    };
    this.currentEpisodeChoices.push(choiceItem);

    let stage: StoryStage = 'first_choice';
    if (data.isClimax) {
      stage = 'climax';
    } else if (data.totalChoicesMade > 1) {
      stage = 'mid_story';
    }

    const activeSec =
      typeof data.activeTimeSeconds === 'number'
        ? data.activeTimeSeconds
        : Math.round((Date.now() - this.activeAttemptStartMs) / 1000);

    // Update local cache
    try {
      const sessions = this.getLocalGameSessions();
      const idx = sessions.findIndex((s) => s.id === this.currentActiveDocId);
      if (idx !== -1) {
        sessions[idx].choicesCount = data.totalChoicesMade;
        sessions[idx].stageReached = stage;
        sessions[idx].dropOffNodeId = data.nodeId;
        sessions[idx].dropOffNodeTitle = data.nodeTitle || data.nodeId;
        sessions[idx].choices = this.currentEpisodeChoices;
        sessions[idx].finalStoryChoice = data.choiceLabel;
        sessions[idx].activePlayTimeSeconds = activeSec;
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
          finalStoryChoice: data.choiceLabel,
          activePlayTimeSeconds: activeSec,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('[Analytics] Could not update session choice in Firestore:', err);
      }
    }
  }

  static async completeRealGameSession(data: {
    episodeId: string;
    episodeNumber?: string;
    episodeTitle?: string;
    choicesCount: number;
    finalChoiceLabel?: string;
    pollOption?: string; // Explicit Uncle Rwamiti reflection poll response
    endingTitle?: string;
    isReplay?: boolean;
    activeTimeSeconds?: number;
  }): Promise<void> {
    const canonical = getCanonicalStoryInfo(data.episodeId, data.episodeNumber, data.episodeTitle);
    const visitorId = this.getOrCreateVisitorId();
    const demo = this.getPlayerDemographics();
    const deviceType = this.detectDeviceType();
    const ref = this.detectReferralDetails();
    const tz = this.detectBrowserTimezone();
    const timestamp = Date.now();
    const dateUganda = formatUgandaDateTime(timestamp);

    const activeSec =
      typeof data.activeTimeSeconds === 'number'
        ? data.activeTimeSeconds
        : Math.round((Date.now() - this.activeAttemptStartMs) / 1000);

    const pacing: GameSessionRecord['playPacing'] =
      activeSec < 15
        ? 'Rapid (<15s)'
        : activeSec <= 60
        ? 'Quick (15–60s)'
        : 'Paced (>60s)';

    // Increment visitor's gamesCompleted in Firestore
    try {
      const db = getDb();
      const visitorRef = doc(db, 'visitors', visitorId);
      updateDoc(visitorRef, {
        gamesCompleted: increment(1),
        lastCompletedEpisodeId: canonical.canonicalId,
        lastCompletedAt: new Date(timestamp).toISOString(),
      }).catch(() => {});
    } catch {
      // ignore
    }

    const testClassification = isTestSessionRecord(
      {
        id: '',
        visitorId,
        timestamp,
        dateStr: dateUganda,
        episodeId: canonical.canonicalId,
        episodeNumber: canonical.episodeNumber,
        episodeTitle: canonical.episodeTitle,
        ageBracket: demo.ageBracket || 'Undisclosed',
        gender: demo.gender || 'Prefer not to say',
        location: demo.location || 'Undisclosed',
        deviceType,
        stageReached: 'completed',
        choices: this.currentEpisodeChoices,
        choicesCount: data.choicesCount,
        completed: true,
        isReplay: !!data.isReplay,
        referralSource: ref.source,
        countryOrTimezone: `Browser System TZ: ${tz}`,
      },
      undefined,
      this.getFlaggedTestVisitors()
    );

    // Update existing active document
    if (this.currentActiveDocId && !this.currentActiveDocId.startsWith('local_')) {
      try {
        const db = getDb();
        const docRef = doc(db, 'gameSessions', this.currentActiveDocId);
        await updateDoc(docRef, {
          completed: true,
          stageReached: 'completed',
          dropOffNodeId: 'completed',
          dropOffNodeTitle: data.endingTitle || 'Story Finale Completed',
          choicesCount: data.choicesCount,
          finalStoryChoice: data.finalChoiceLabel || this.currentEpisodeChoices.slice(-1)[0]?.choiceLabel || '',
          pollOption: data.pollOption || '',
          endingReachedTitle: data.endingTitle || 'Story Complete',
          completedAt: new Date().toISOString(),
          activePlayTimeSeconds: activeSec,
          playPacing: pacing,
          isTest: testClassification.isTest,
          testFlagReason: testClassification.reason,
          ageBracket: demo.ageBracket || 'Undisclosed',
          gender: demo.gender || 'Prefer not to say',
          location: demo.location || 'Undisclosed',
        });

        // Update local cache
        const sessions = this.getLocalGameSessions();
        const idx = sessions.findIndex((s) => s.id === this.currentActiveDocId);
        if (idx !== -1) {
          sessions[idx].completed = true;
          sessions[idx].stageReached = 'completed';
          sessions[idx].dropOffNodeId = 'completed';
          sessions[idx].dropOffNodeTitle = data.endingTitle || 'Story Complete';
          sessions[idx].choicesCount = data.choicesCount;
          sessions[idx].finalStoryChoice = data.finalChoiceLabel || '';
          sessions[idx].pollOption = data.pollOption;
          sessions[idx].activePlayTimeSeconds = activeSec;
          sessions[idx].playPacing = pacing;
          sessions[idx].isTest = testClassification.isTest;
          sessions[idx].testFlagReason = testClassification.reason;
          localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
        }

        // Clear active attempt from sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(`rwamiti_active_attempt_${canonical.canonicalId}`);
        }
        return;
      } catch (err) {
        console.warn('[Analytics] Could not update completion in Firestore, fallback to addDoc:', err);
      }
    }

    // Direct fallback record
    const sessionRecord: GameSessionRecord = {
      id: 'gs_' + Math.random().toString(36).substring(2, 10),
      visitorId,
      timestamp,
      dateStr: dateUganda,
      dateUganda,
      dateIso: new Date(timestamp).toISOString(),
      episodeId: canonical.canonicalId,
      episodeNumber: canonical.episodeNumber,
      episodeTitle: canonical.episodeTitle,
      storyIdentifier: canonical.storyIdentifier,
      ageBracket: demo.ageBracket || 'Undisclosed',
      gender: demo.gender || 'Prefer not to say',
      location: demo.location || 'Undisclosed',
      deviceType,
      stageReached: 'completed',
      dropOffNodeId: 'completed',
      dropOffNodeTitle: data.endingTitle || 'Story Complete',
      choices: this.currentEpisodeChoices,
      choicesCount: data.choicesCount,
      completed: true,
      completedAt: new Date().toISOString(),
      isReplay: !!data.isReplay,
      finalStoryChoice: data.finalChoiceLabel || '',
      pollOption: data.pollOption || '',
      endingReachedTitle: data.endingTitle || 'Story Complete',
      referralSource: ref.source,
      referralChannel: ref.channel,
      referralMedium: ref.medium,
      countryOrTimezone: `Browser System TZ: ${tz}`,
      activePlayTimeSeconds: activeSec,
      playPacing: pacing,
      isTest: testClassification.isTest,
      testFlagReason: testClassification.reason,
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

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`rwamiti_active_attempt_${canonical.canonicalId}`);
    }
  }

  // Backward compatibility alias
  static async recordGameSession(data: {
    episodeId: string;
    episodeNumber?: string;
    episodeTitle?: string;
    completed: boolean;
    choicesCount: number;
    pollOption?: string;
  }): Promise<void> {
    if (data.completed) {
      await this.completeRealGameSession({
        ...data,
        finalChoiceLabel: data.pollOption,
      });
    } else {
      await this.startRealGameSession(data);
    }
  }

  // -------------------------------------------------------------
  // 7. STORY ENGINE INTEGRATION HELPERS
  // -------------------------------------------------------------

  static recordStoryStarted(
    episodeId: string,
    episodeTitle?: string,
    isReplay: boolean = false
  ): void {
    const canonical = getCanonicalStoryInfo(episodeId, undefined, episodeTitle);
    this.startRealGameSession({
      episodeId: canonical.canonicalId,
      episodeNumber: canonical.episodeNumber,
      episodeTitle: canonical.episodeTitle,
      isReplay,
    }).catch(() => {});
    this.track('story_started', { episodeId: canonical.canonicalId });
  }

  static recordChoiceSelected(data: {
    episodeId: string;
    nodeId: string;
    choiceLabel: string;
    choiceId?: string;
    totalChoicesMade?: number;
    activeTimeSeconds?: number;
    episodeTitle?: string;
  } | string, nodeId?: string, choiceLabel?: string): void {
    if (typeof data === 'string') {
      // Legacy signature fallback
      const epId = data;
      const nId = nodeId || 'unknown';
      const cLabel = choiceLabel || 'Option';
      this.updateRealGameSessionChoice({
        choiceId: nId,
        choiceLabel: cLabel,
        nodeId: nId,
        totalChoicesMade: 1,
      }).catch(() => {});
      this.track('choice_selected', {
        episodeId: epId,
        nodeId: nId,
        choiceLabel: cLabel,
      });
      return;
    }

    const canonical = getCanonicalStoryInfo(data.episodeId, undefined, data.episodeTitle);
    this.updateRealGameSessionChoice({
      choiceId: data.choiceId || data.nodeId,
      choiceLabel: data.choiceLabel,
      nodeId: data.nodeId,
      totalChoicesMade: data.totalChoicesMade || 1,
      activeTimeSeconds: data.activeTimeSeconds,
    }).catch(() => {});

    this.track('choice_selected', {
      episodeId: canonical.canonicalId,
      nodeId: data.nodeId,
      choiceId: data.choiceId || data.nodeId,
      choiceLabel: data.choiceLabel,
    });
  }

  static recordStoryCompleted(data: {
    episodeId: string;
    endingNodeId?: string;
    episodeTitle?: string;
    choicesCount?: number;
    activeTimeSeconds?: number;
    finalChoiceLabel?: string;
    pollOption?: string;
    endingTitle?: string;
  } | string, endingNodeId?: string, episodeTitle?: string, choicesCount: number = 2): void {
    if (typeof data === 'string') {
      // Legacy signature fallback
      const canonical = getCanonicalStoryInfo(data, undefined, episodeTitle);
      this.completeRealGameSession({
        episodeId: canonical.canonicalId,
        episodeNumber: canonical.episodeNumber,
        episodeTitle: canonical.episodeTitle,
        choicesCount,
        endingTitle: endingNodeId,
      }).catch(() => {});
      this.track('story_completed', { episodeId: canonical.canonicalId, nodeId: endingNodeId });
      return;
    }

    const canonical = getCanonicalStoryInfo(data.episodeId, undefined, data.episodeTitle);
    this.completeRealGameSession({
      episodeId: canonical.canonicalId,
      episodeNumber: canonical.episodeNumber,
      episodeTitle: canonical.episodeTitle,
      choicesCount: data.choicesCount || 2,
      finalChoiceLabel: data.finalChoiceLabel,
      pollOption: data.pollOption,
      endingTitle: data.endingTitle || data.endingNodeId,
      activeTimeSeconds: data.activeTimeSeconds,
    }).catch(() => {});

    this.track('story_completed', { episodeId: canonical.canonicalId, nodeId: data.endingNodeId });
  }

  static recordReplayClicked(episodeId: string): void {
    const canonical = getCanonicalStoryInfo(episodeId);
    this.track('replay_clicked', { episodeId: canonical.canonicalId });
  }

  // -------------------------------------------------------------
  // 7B. COMIC BOOKS BEHAVIORAL ANALYTICS
  // -------------------------------------------------------------

  static recordComicStarted(comicId: string, comicTitle?: string): void {
    const canonical = getCanonicalStoryInfo(comicId, undefined, comicTitle);
    this.startRealGameSession({
      episodeId: canonical.canonicalId,
      episodeNumber: canonical.episodeNumber,
      episodeTitle: canonical.episodeTitle,
      isReplay: false,
    }).catch(() => {});
    this.track('story_started', { episodeId: canonical.canonicalId, metadata: { category: 'Comics' } });
  }

  static recordComicPanelRead(data: {
    comicId: string;
    panelNumber: number;
    totalPanels: number;
    activeTimeSeconds?: number;
    choiceLabel?: string;
    comicTitle?: string;
  }): void {
    const canonical = getCanonicalStoryInfo(data.comicId, undefined, data.comicTitle);
    this.updateRealGameSessionChoice({
      choiceId: `panel-${data.panelNumber}`,
      choiceLabel: data.choiceLabel || `Read Panel ${data.panelNumber}`,
      nodeId: `panel-${data.panelNumber}`,
      nodeTitle: `Panel ${data.panelNumber} of ${data.totalPanels}`,
      totalChoicesMade: data.panelNumber,
      activeTimeSeconds: data.activeTimeSeconds,
    }).catch(() => {});

    this.track('choice_selected', {
      episodeId: canonical.canonicalId,
      nodeId: `panel-${data.panelNumber}`,
      choiceLabel: data.choiceLabel || `Panel ${data.panelNumber}`,
    });
  }

  static recordComicCompleted(data: {
    comicId: string;
    comicTitle?: string;
    choicesCount?: number;
    activeTimeSeconds?: number;
    finalChoiceLabel?: string;
    pollOption?: string;
    endingTitle?: string;
  }): void {
    const canonical = getCanonicalStoryInfo(data.comicId, undefined, data.comicTitle);
    this.completeRealGameSession({
      episodeId: canonical.canonicalId,
      episodeNumber: canonical.episodeNumber,
      episodeTitle: canonical.episodeTitle,
      choicesCount: data.choicesCount || 1,
      finalChoiceLabel: data.finalChoiceLabel,
      pollOption: data.pollOption,
      endingTitle: data.endingTitle || 'Comic Complete',
      activeTimeSeconds: data.activeTimeSeconds,
    }).catch(() => {});

    this.track('story_completed', { episodeId: canonical.canonicalId, metadata: { category: 'Comics' } });
  }

  // -------------------------------------------------------------
  // 8. TEST VISITOR ADMIN FLAGGING
  // -------------------------------------------------------------

  static getFlaggedTestVisitors(): Set<string> {
    if (typeof window === 'undefined') return new Set(KNOWN_TEST_VISITOR_IDS);
    try {
      const raw = localStorage.getItem(FLAGGED_TEST_VISITORS_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        return new Set([...KNOWN_TEST_VISITOR_IDS, ...arr]);
      }
    } catch {
      // ignore
    }
    return new Set(KNOWN_TEST_VISITOR_IDS);
  }

  static toggleFlagTestVisitor(visitorId: string): boolean {
    const current = this.getFlaggedTestVisitors();
    const isCurrentlyFlagged = current.has(visitorId);
    if (isCurrentlyFlagged) {
      current.delete(visitorId);
    } else {
      current.add(visitorId);
    }
    try {
      localStorage.setItem(
        FLAGGED_TEST_VISITORS_KEY,
        JSON.stringify(Array.from(current).filter((id) => !KNOWN_TEST_VISITOR_IDS.has(id)))
      );
    } catch {
      // ignore
    }
    return !isCurrentlyFlagged;
  }

  // -------------------------------------------------------------
  // 9. LOCAL CACHING & FIRESTORE LISTENERS
  // -------------------------------------------------------------

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

  static subscribeToGameSessions(callback: (sessions: GameSessionRecord[]) => void): () => void {
    try {
      const db = getDb();
      const sessionsRef = collection(db, 'gameSessions');
      const q = query(sessionsRef, orderBy('timestamp', 'desc'), limit(500));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: GameSessionRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as any;
            const canonical = getCanonicalStoryInfo(
              data.episodeId,
              data.episodeNumber,
              data.episodeTitle
            );
            const ts = data.timestamp || Date.now();
            const dateUganda = data.dateUganda || formatUgandaDateTime(ts);

            list.push({
              id: docSnap.id,
              visitorId: data.visitorId || 'legacy_visitor',
              timestamp: ts,
              dateStr: dateUganda,
              dateUganda,
              dateIso: data.dateIso || new Date(ts).toISOString(),
              episodeId: canonical.canonicalId,
              episodeNumber: canonical.episodeNumber,
              episodeTitle: canonical.episodeTitle,
              storyIdentifier: canonical.storyIdentifier,
              ageBracket: data.ageBracket || 'Undisclosed',
              gender: data.gender || 'Prefer not to say',
              location: data.location || 'Undisclosed',
              deviceType: data.deviceType || 'Mobile',
              stageReached: data.stageReached || (data.completed ? 'completed' : 'opened'),
              dropOffNodeId: data.dropOffNodeId,
              dropOffNodeTitle: data.dropOffNodeTitle,
              choices: Array.isArray(data.choices) ? data.choices : [],
              choicesCount: data.choicesCount || (Array.isArray(data.choices) ? data.choices.length : 0),
              completed: !!data.completed,
              completedAt: data.completedAt,
              isReplay: !!data.isReplay,
              finalStoryChoice: data.finalStoryChoice || '',
              pollOption: data.pollOption || '',
              endingReachedTitle: data.endingReachedTitle || data.dropOffNodeTitle || '',
              referralSource: data.referralSource || 'Direct / Unknown Traffic',
              referralChannel: data.referralChannel || 'Direct',
              referralMedium: data.referralMedium || 'none',
              countryOrTimezone: data.countryOrTimezone || 'Browser System TZ: Africa/Kampala',
              activePlayTimeSeconds: data.activePlayTimeSeconds || 0,
              playPacing: data.playPacing,
              isTest: !!data.isTest,
              testFlagReason: data.testFlagReason,
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
              visitorId: docSnap.id,
              visitCount: data.visitCount || 1,
              firstVisit: data.firstVisit || Date.now(),
              lastVisit: data.lastVisit || Date.now(),
              isReturning: !!data.isReturning,
              referralSource: data.referralSource || 'Direct / Unknown Traffic',
              deviceType: data.deviceType || 'Mobile',
              countryOrTimezone: data.countryOrTimezone || 'Browser System TZ: Africa/Kampala',
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

  // -------------------------------------------------------------
  // 10. COMPREHENSIVE BEHAVIOURAL & AUDIENCE REPORTING ENGINE
  // -------------------------------------------------------------

  static getComprehensiveAnalytics(
    rawSessions: GameSessionRecord[],
    visitors: VisitorRecord[],
    filterEpisodeId?: string,
    excludeTests: boolean = true
  ) {
    const adminFlaggedVisitors = this.getFlaggedTestVisitors();

    // Group raw sessions by visitor to support automated burst analysis
    const sessionsByVisitor: Record<string, GameSessionRecord[]> = {};
    rawSessions.forEach((s) => {
      if (!sessionsByVisitor[s.visitorId]) sessionsByVisitor[s.visitorId] = [];
      sessionsByVisitor[s.visitorId].push(s);
    });

    // 1. Tag test activity on each session
    const classifiedSessions = rawSessions.map((s) => {
      const testStatus = isTestSessionRecord(
        s,
        sessionsByVisitor[s.visitorId],
        adminFlaggedVisitors
      );
      return {
        ...s,
        isTest: testStatus.isTest,
        testFlagReason: testStatus.reason,
      };
    });

    // 2. Count test records and test visitors
    const testSessionsList = classifiedSessions.filter((s) => s.isTest);
    const testVisitorIds = new Set<string>();
    testSessionsList.forEach((s) => testVisitorIds.add(s.visitorId));
    const filteredTestCount = testSessionsList.length;
    const filteredTestCompletionsCount = testSessionsList.filter((s) => s.completed).length;
    const filteredTestVisitorsCount = testVisitorIds.size;

    // 3. Filter test activity if requested (default true)
    const baseSessions = excludeTests
      ? classifiedSessions.filter((s) => !s.isTest)
      : classifiedSessions;

    // 4. Apply deduplication to merge duplicate submissions or refresh artifacts
    const deduplicatedSessions = deduplicateGameSessions(baseSessions);

    // 5. Apply story filter
    const filteredAttempts = deduplicatedSessions.filter((s) => {
      if (filterEpisodeId && filterEpisodeId !== 'all') {
        const canonical = getCanonicalStoryInfo(s.episodeId, s.episodeNumber, s.episodeTitle);
        return (
          canonical.canonicalId === filterEpisodeId ||
          canonical.episodeNumber === filterEpisodeId ||
          s.episodeId === filterEpisodeId
        );
      }
      return true;
    });

    // -----------------------------------------------------------
    // DISTINCT AUDIENCE & ATTEMPTS METRICS
    // -----------------------------------------------------------

    const distinctAudienceVisitorIds = new Set<string>();
    filteredAttempts.forEach((s) => {
      if (s.visitorId) distinctAudienceVisitorIds.add(s.visitorId);
    });
    visitors.forEach((v) => {
      if (excludeTests && (adminFlaggedVisitors.has(v.visitorId) || KNOWN_TEST_VISITOR_IDS.has(v.visitorId))) {
        return;
      }
      distinctAudienceVisitorIds.add(v.visitorId);
    });

    const uniqueVisitorsCount = distinctAudienceVisitorIds.size;

    // Distinct visitors who initiated at least one game attempt
    const distinctGamePlayerIds = new Set<string>();
    filteredAttempts.forEach((s) => {
      if (s.visitorId) distinctGamePlayerIds.add(s.visitorId);
    });
    const gamePlayersCount = distinctGamePlayerIds.size;
    const playerConversionRate =
      uniqueVisitorsCount > 0 ? Math.round((gamePlayersCount / uniqueVisitorsCount) * 100) : 0;

    // Attempts metrics
    const attemptsStartedCount = filteredAttempts.length;
    const reachedFirstChoiceCount = filteredAttempts.filter(
      (s) => s.stageReached !== 'opened' || (s.choicesCount || 0) >= 1 || s.completed
    ).length;
    const firstChoiceConversionRate =
      attemptsStartedCount > 0
        ? Math.round((reachedFirstChoiceCount / attemptsStartedCount) * 100)
        : 0;

    const completedAttemptsCount = filteredAttempts.filter((s) => s.completed).length;

    // STRICT ATTEMPT-BASED COMPLETION RATE: (Completed Attempts / Attempts Started) * 100
    const attemptCompletionRate =
      attemptsStartedCount > 0
        ? Math.round((completedAttemptsCount / attemptsStartedCount) * 100)
        : 0;

    const firstChoiceToCompletionRate =
      reachedFirstChoiceCount > 0
        ? Math.round((completedAttemptsCount / reachedFirstChoiceCount) * 100)
        : 0;

    const totalReplaysCount = filteredAttempts.filter((s) => s.isReplay).length;

    // -----------------------------------------------------------
    // ACTIVE PLAY TIME & PACING
    // -----------------------------------------------------------
    const completedWithTime = filteredAttempts.filter(
      (s) => s.completed && (s.activePlayTimeSeconds || 0) > 0
    );
    const totalPlaySeconds = completedWithTime.reduce(
      (acc, s) => acc + (s.activePlayTimeSeconds || 0),
      0
    );
    const avgActivePlayTimeSeconds =
      completedWithTime.length > 0 ? Math.round(totalPlaySeconds / completedWithTime.length) : 0;

    const pacingCounts = {
      considered: 0, // > 60s
      quick: 0, // 15s - 60s
      rapid: 0, // < 15s
    };

    filteredAttempts.forEach((s) => {
      const sec = s.activePlayTimeSeconds || 0;
      if (sec >= 60) pacingCounts.considered++;
      else if (sec >= 15) pacingCounts.quick++;
      else pacingCounts.rapid++;
    });

    const formatDuration = (secs: number) => {
      if (!secs || secs <= 0) return '0s';
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    // -----------------------------------------------------------
    // NUMBER OF GAMES PLAYED PER VISITOR
    // -----------------------------------------------------------
    const attemptsPerVisitorMap: Record<string, number> = {};
    filteredAttempts.forEach((s) => {
      const vid = s.visitorId || 'anonymous';
      attemptsPerVisitorMap[vid] = (attemptsPerVisitorMap[vid] || 0) + 1;
    });

    const totalAttemptsAcrossVisitors = Object.values(attemptsPerVisitorMap).reduce(
      (a, b) => a + b,
      0
    );
    const avgGamesPerVisitor =
      gamePlayersCount > 0 ? +(totalAttemptsAcrossVisitors / gamePlayersCount).toFixed(1) : 0;

    const distributionCounts = {
      '1 Story': 0,
      '2–3 Stories': 0,
      '4–5 Stories': 0,
      '6+ Stories': 0,
    };

    Object.values(attemptsPerVisitorMap).forEach((count) => {
      if (count === 1) distributionCounts['1 Story'] += 1;
      else if (count <= 3) distributionCounts['2–3 Stories'] += 1;
      else if (count <= 5) distributionCounts['4–5 Stories'] += 1;
      else distributionCounts['6+ Stories'] += 1;
    });

    const gamesPerVisitorDistribution = Object.entries(distributionCounts).map(
      ([label, count]) => ({
        label,
        count,
        percentage: gamePlayersCount > 0 ? Math.round((count / gamePlayersCount) * 100) : 0,
      })
    );

    // -----------------------------------------------------------
    // STORY-BY-STORY PERFORMANCE REPORT
    // -----------------------------------------------------------
    const episodeStatsMap: Record<
      string,
      {
        id: string;
        number: string;
        title: string;
        storyIdentifier: string;
        startsCount: number;
        reachedFirstChoiceCount: number;
        completionsCount: number;
        replaysCount: number;
        totalChoicesMade: number;
        activePlayTimeTotal: number;
      }
    > = {};

    filteredAttempts.forEach((s) => {
      const canonical = getCanonicalStoryInfo(s.episodeId, s.episodeNumber, s.episodeTitle);
      const epKey = canonical.canonicalId;

      if (!episodeStatsMap[epKey]) {
        episodeStatsMap[epKey] = {
          id: canonical.canonicalId,
          number: canonical.episodeNumber,
          title: canonical.episodeTitle,
          storyIdentifier: canonical.storyIdentifier,
          startsCount: 0,
          reachedFirstChoiceCount: 0,
          completionsCount: 0,
          replaysCount: 0,
          totalChoicesMade: 0,
          activePlayTimeTotal: 0,
        };
      }

      episodeStatsMap[epKey].startsCount += 1;
      if (s.stageReached !== 'opened' || (s.choicesCount || 0) >= 1 || s.completed) {
        episodeStatsMap[epKey].reachedFirstChoiceCount += 1;
      }
      if (s.completed) {
        episodeStatsMap[epKey].completionsCount += 1;
      }
      if (s.isReplay) {
        episodeStatsMap[epKey].replaysCount += 1;
      }
      episodeStatsMap[epKey].totalChoicesMade += s.choicesCount || 0;
      episodeStatsMap[epKey].activePlayTimeTotal += s.activePlayTimeSeconds || 0;
    });

    const episodePerformanceList = Object.values(episodeStatsMap)
      .map((ep) => {
        const completionRate =
          ep.startsCount > 0 ? Math.round((ep.completionsCount / ep.startsCount) * 100) : 0;
        const firstChoiceRate =
          ep.startsCount > 0 ? Math.round((ep.reachedFirstChoiceCount / ep.startsCount) * 100) : 0;
        const avgChoices =
          ep.startsCount > 0 ? +(ep.totalChoicesMade / ep.startsCount).toFixed(1) : 0;
        const avgPlaySec =
          ep.completionsCount > 0
            ? Math.round(ep.activePlayTimeTotal / ep.completionsCount)
            : Math.round(ep.activePlayTimeTotal / (ep.startsCount || 1));

        return {
          ...ep,
          completionRate,
          firstChoiceRate,
          avgChoices,
          avgPlayTimeFormatted: formatDuration(avgPlaySec),
        };
      })
      .sort((a, b) => b.startsCount - a.startsCount);

    const mostPlayedEpisode = episodePerformanceList[0] || null;
    const leastPlayedEpisode =
      episodePerformanceList.length > 1
        ? episodePerformanceList[episodePerformanceList.length - 1]
        : null;

    // -----------------------------------------------------------
    // DROP-OFF FUNNEL (BASED ON IDENTIFIABLE ATTEMPTS)
    // -----------------------------------------------------------
    const reachedMidStory = filteredAttempts.filter(
      (s) =>
        s.stageReached === 'mid_story' ||
        s.stageReached === 'climax' ||
        s.stageReached === 'completed' ||
        (s.choicesCount || 0) >= 2
    ).length;

    const reachedClimax = filteredAttempts.filter(
      (s) => s.stageReached === 'climax' || s.stageReached === 'completed'
    ).length;

    const funnelStages = [
      {
        stage: '1. Attempt Started',
        description: 'Crossroad situation opened',
        count: attemptsStartedCount,
        conversionPct: attemptsStartedCount > 0 ? 100 : 0,
        dropOffFromPrevPct: 0,
      },
      {
        stage: '2. First Decision Made',
        description: 'Committed to first story path',
        count: reachedFirstChoiceCount,
        conversionPct: firstChoiceConversionRate,
        dropOffFromPrevPct:
          attemptsStartedCount > 0
            ? Math.round(
                ((attemptsStartedCount - reachedFirstChoiceCount) / attemptsStartedCount) * 100
              )
            : 0,
      },
      {
        stage: '3. Mid-Story Dilemma',
        description: 'Navigated downstream consequence (2+ moves)',
        count: reachedMidStory,
        conversionPct:
          attemptsStartedCount > 0
            ? Math.round((reachedMidStory / attemptsStartedCount) * 100)
            : 0,
        dropOffFromPrevPct:
          reachedFirstChoiceCount > 0
            ? Math.round(
                ((reachedFirstChoiceCount - reachedMidStory) / reachedFirstChoiceCount) * 100
              )
            : 0,
      },
      {
        stage: '4. Moral Climax Reached',
        description: 'Arrived at threshold of final crisis',
        count: reachedClimax,
        conversionPct:
          attemptsStartedCount > 0
            ? Math.round((reachedClimax / attemptsStartedCount) * 100)
            : 0,
        dropOffFromPrevPct:
          reachedMidStory > 0
            ? Math.round(((reachedMidStory - reachedClimax) / reachedMidStory) * 100)
            : 0,
      },
      {
        stage: '5. Completed Finale',
        description: 'Witnessed ending & moral wisdom',
        count: completedAttemptsCount,
        conversionPct: attemptCompletionRate,
        dropOffFromPrevPct:
          reachedClimax > 0
            ? Math.round(((reachedClimax - completedAttemptsCount) / reachedClimax) * 100)
            : 0,
      },
    ];

    // Drop-off bottlenecks
    const dropOffBottlenecks: Record<string, { title: string; count: number }> = {};
    filteredAttempts
      .filter((s) => !s.completed)
      .forEach((s) => {
        const canonical = getCanonicalStoryInfo(s.episodeId, s.episodeNumber, s.episodeTitle);
        const nodeTitle = s.dropOffNodeTitle || s.dropOffNodeId || 'Intro / Opening Scene';
        const key = `${canonical.storyIdentifier} · ${nodeTitle}`;
        if (!dropOffBottlenecks[key]) {
          dropOffBottlenecks[key] = { title: key, count: 0 };
        }
        dropOffBottlenecks[key].count += 1;
      });

    const dropOffBottlenecksList = Object.values(dropOffBottlenecks)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // -----------------------------------------------------------
    // CHOICES DISTRIBUTION (WITH READABLE LABELS)
    // -----------------------------------------------------------
    const choicesMadeMap: Record<
      string,
      {
        episodeTitle: string;
        choiceLabel: string;
        count: number;
      }
    > = {};

    filteredAttempts.forEach((s) => {
      const canonical = getCanonicalStoryInfo(s.episodeId, s.episodeNumber, s.episodeTitle);
      if (Array.isArray(s.choices)) {
        s.choices.forEach((c) => {
          const readable = c.choiceLabel && c.choiceLabel !== 'OPTIONS' ? c.choiceLabel : 'Read next scene';
          const key = `${canonical.storyIdentifier} · ${readable}`;
          if (!choicesMadeMap[key]) {
            choicesMadeMap[key] = {
              episodeTitle: canonical.storyIdentifier,
              choiceLabel: readable,
              count: 0,
            };
          }
          choicesMadeMap[key].count += 1;
        });
      }
    });

    const choicesDistributionList = Object.values(choicesMadeMap).sort((a, b) => b.count - a.count);

    // -----------------------------------------------------------
    // REFERRAL & CHANNEL DISTRIBUTION
    // -----------------------------------------------------------
    const channelCounts: Record<string, number> = {
      WhatsApp: 0,
      LinkedIn: 0,
      Facebook: 0,
      Workvivo: 0,
      Search: 0,
      'Direct / Unknown': 0,
      'Friend Challenge': 0,
      'X / Twitter': 0,
      Other: 0,
    };

    filteredAttempts.forEach((s) => {
      const src = (s.referralSource || '').toLowerCase();
      const ch = s.referralChannel;

      if (ch === 'WhatsApp' || src.includes('whatsapp')) channelCounts['WhatsApp']++;
      else if (ch === 'LinkedIn' || src.includes('linkedin')) channelCounts['LinkedIn']++;
      else if (ch === 'Facebook' || src.includes('facebook')) channelCounts['Facebook']++;
      else if (ch === 'Workvivo' || src.includes('workvivo')) channelCounts['Workvivo']++;
      else if (ch?.includes('Search') || src.includes('search') || src.includes('google')) channelCounts['Search']++;
      else if (ch === 'Challenge' || src.includes('challenge')) channelCounts['Friend Challenge']++;
      else if (src.includes('twitter') || src.includes('x.com')) channelCounts['X / Twitter']++;
      else if (src.includes('direct') || src.includes('unknown') || !src) channelCounts['Direct / Unknown']++;
      else channelCounts['Other']++;
    });

    const rawEvents = this.getEvents();
    const inAppShareClicks = rawEvents.filter(
      (e) => e.eventName === 'challenge_friend_clicked'
    ).length;

    const referralDistribution = Object.entries(channelCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: attemptsStartedCount > 0 ? Math.round((count / attemptsStartedCount) * 100) : 0,
      }))
      .filter((r) => r.count > 0 || attemptsStartedCount === 0)
      .sort((a, b) => b.count - a.count);

    // -----------------------------------------------------------
    // DEVICE, LOCATION, AGE & GENDER
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
    const timezoneCounts: Record<string, number> = {};

    filteredAttempts.forEach((s) => {
      // Device
      const dev = s.deviceType || 'Mobile';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;

      // Age
      const age = s.ageBracket || 'Undisclosed';
      ageCounts[age] = (ageCounts[age] || 0) + 1;

      // Gender
      const g = s.gender || 'Prefer not to say';
      genderCounts[g] = (genderCounts[g] || 0) + 1;

      // District / Location (User-Reported vs Undisclosed)
      const locFormat = this.formatLocationAndSystemTimezone(s.location, s.countryOrTimezone);
      locationCounts[locFormat.displayLocation] = (locationCounts[locFormat.displayLocation] || 0) + 1;

      // System Timezone
      timezoneCounts[locFormat.systemTimezone] = (timezoneCounts[locFormat.systemTimezone] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: attemptsStartedCount > 0 ? Math.round((count / attemptsStartedCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const topTimezones = Object.entries(timezoneCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: attemptsStartedCount > 0 ? Math.round((count / attemptsStartedCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const ageDistribution = Object.entries(ageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: attemptsStartedCount > 0 ? Math.round((count / attemptsStartedCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const genderDistribution = Object.entries(genderCounts).map(([name, count]) => ({
      name,
      count,
      percentage: attemptsStartedCount > 0 ? Math.round((count / attemptsStartedCount) * 100) : 0,
    }));

    return {
      // Distinct Audience KPIs
      uniqueVisitorsCount,
      gamePlayersCount,
      playerConversionRate,

      // Attempt-Based Metrics
      attemptsStartedCount,
      reachedFirstChoiceCount,
      firstChoiceConversionRate,
      completedAttemptsCount,
      attemptCompletionRate,
      firstChoiceToCompletionRate,
      totalReplaysCount,
      avgGamesPerVisitor,
      gamesPerVisitorDistribution,

      // Active Play Duration & Pacing
      avgActivePlayTimeSeconds,
      avgActivePlayTimeFormatted: formatDuration(avgActivePlayTimeSeconds),
      pacingCounts,

      // Test Filtering Metadata
      excludeTests,
      filteredTestCount,
      filteredTestCompletionsCount,
      filteredTestVisitorsCount,

      // Catalogue & Drop-off Reporting
      episodePerformanceList,
      mostPlayedEpisode,
      leastPlayedEpisode,
      funnelStages,
      dropOffBottlenecksList,
      choicesDistributionList,
      referralDistribution,
      inAppShareClicks,

      // Demographics & Systems
      deviceCounts,
      topLocations,
      topTimezones,
      ageDistribution,
      genderDistribution,

      // Recent attempts log
      recentSessions: filteredAttempts.slice(0, 100),

      // Legacy compatibility aliases
      totalStarts: attemptsStartedCount,
      totalCompletions: completedAttemptsCount,
      overallCompletionRate: attemptCompletionRate,
    };
  }

  static getDemographicSummary(sessions: GameSessionRecord[], filterEpisodeId?: string) {
    return this.getComprehensiveAnalytics(sessions, this.getLocalVisitors(), filterEpisodeId, true);
  }

  // -------------------------------------------------------------
  // 11. ENHANCED CSV EXPORTS
  // -------------------------------------------------------------

  /**
   * Exports audience analytics CSV with Uganda Time (EAT), canonical identifiers,
   * separated story choices vs poll votes, and active play duration.
   */
  static exportDemographicsCSV(sessions: GameSessionRecord[], excludeTests: boolean = true): string {
    const adminFlaggedVisitors = this.getFlaggedTestVisitors();
    const sessionsByVisitor: Record<string, GameSessionRecord[]> = {};
    sessions.forEach((s) => {
      if (!sessionsByVisitor[s.visitorId]) sessionsByVisitor[s.visitorId] = [];
      sessionsByVisitor[s.visitorId].push(s);
    });

    const classified = sessions.map((s) => {
      const status = isTestSessionRecord(s, sessionsByVisitor[s.visitorId], adminFlaggedVisitors);
      return {
        ...s,
        isTest: status.isTest,
        testFlagReason: status.reason,
      };
    });

    const base = excludeTests ? classified.filter((s) => !s.isTest) : classified;
    const deduplicated = deduplicateGameSessions(base);

    const headers = [
      'Attempt_ID',
      'Visitor_ID',
      'Is_Test_Run',
      'Test_Flag_Reason',
      'Date_Time_Uganda_EAT',
      'Timestamp_UTC_ISO',
      'Story_Identifier',
      'Episode_Number',
      'Episode_Title',
      'Stage_Reached',
      'Completed',
      'Decisions_Made',
      'Final_Story_Choice',
      'Uncle_Rwamiti_Reflection_Poll_Vote',
      'Ending_Reached_Title',
      'Active_Play_Time_Formatted',
      'Active_Play_Time_Seconds',
      'Play_Pacing_Classification',
      'Age_Bracket',
      'Gender',
      'Reported_District_Location',
      'Browser_System_Timezone',
      'Device_Type',
      'Referral_Source',
      'Referral_Channel',
      'Is_Replay',
    ];

    const formatDuration = (secs: number) => {
      if (!secs || secs <= 0) return '0s';
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };

    const rows = deduplicated.map((s) => {
      const canonical = getCanonicalStoryInfo(s.episodeId, s.episodeNumber, s.episodeTitle);
      const dateUganda = s.dateUganda || formatUgandaDateTime(s.timestamp);
      const dateIso = s.dateIso || new Date(s.timestamp).toISOString();
      const loc = this.formatLocationAndSystemTimezone(s.location, s.countryOrTimezone);
      const playSec = s.activePlayTimeSeconds || 0;
      const pacing = s.playPacing || (playSec < 15 ? 'Rapid (<15s)' : playSec <= 60 ? 'Quick (15–60s)' : 'Paced (>60s)');
      const rawChoice = s.finalStoryChoice || (Array.isArray(s.choices) && s.choices.length > 0 ? s.choices[s.choices.length - 1].choiceLabel : '');
      const finalChoice = resolveReadableChoiceLabel(s.episodeId, s.dropOffNodeId, rawChoice);
      const pollVote = resolveReadablePollVote(s.episodeId, s.pollOption);
      const endingTitle = s.endingReachedTitle || s.dropOffNodeTitle || (s.completed ? 'Story Completed' : 'Incomplete');

      return [
        s.id,
        s.visitorId || 'N/A',
        s.isTest ? 'YES' : 'NO',
        `"${(s.testFlagReason || 'Real Audience Activity').replace(/"/g, '""')}"`,
        `"${dateUganda}"`,
        `"${dateIso}"`,
        `"${canonical.storyIdentifier.replace(/"/g, '""')}"`,
        canonical.episodeNumber,
        `"${canonical.episodeTitle.replace(/"/g, '""')}"`,
        s.stageReached || (s.completed ? 'completed' : 'opened'),
        s.completed ? 'YES' : 'NO',
        s.choicesCount || 0,
        `"${(finalChoice || '').replace(/"/g, '""')}"`,
        `"${pollVote.replace(/"/g, '""')}"`,
        `"${endingTitle.replace(/"/g, '""')}"`,
        `"${formatDuration(playSec)}"`,
        playSec,
        `"${pacing}"`,
        `"${s.ageBracket || 'Undisclosed'}"`,
        `"${s.gender || 'Prefer not to say'}"`,
        `"${loc.verifiedLocation.replace(/"/g, '""')}"`,
        `"${loc.systemTimezone.replace(/"/g, '""')}"`,
        s.deviceType || 'Mobile',
        `"${(s.referralSource || 'Direct / Unknown Traffic').replace(/"/g, '""')}"`,
        `"${(s.referralChannel || 'Direct').replace(/"/g, '""')}"`,
        s.isReplay ? 'YES' : 'NO',
      ];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Exports full audit CSV including all test records with Is_Test_Run = YES clearly designated.
   */
  static exportAllRecordsCSV(sessions: GameSessionRecord[]): string {
    return this.exportDemographicsCSV(sessions, false);
  }

  static exportRawEventsCSV(): string {
    const events = this.getEvents();
    const headers = [
      'Event_ID',
      'Date_Time_Uganda_EAT',
      'Timestamp_UTC',
      'Event_Name',
      'Episode_Identifier',
      'Node_ID',
      'Choice_ID',
      'Choice_Label',
    ];

    const rows = events.map((e) => {
      const canonical = getCanonicalStoryInfo(e.episodeId || '');
      return [
        e.id,
        `"${formatUgandaDateTime(e.timestamp)}"`,
        `"${new Date(e.timestamp).toISOString()}"`,
        e.eventName,
        `"${canonical.storyIdentifier.replace(/"/g, '""')}"`,
        e.nodeId || '',
        e.choiceId || '',
        `"${(e.choiceLabel || '').replace(/"/g, '""')}"`,
      ];
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static exportCSV(): string {
    return this.exportRawEventsCSV();
  }

  // -------------------------------------------------------------
  // 12. RAW EVENTS LOGGING
  // -------------------------------------------------------------

  static getEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return [];
  }

  static track(
    eventName: AnalyticsEvent['eventName'] | 'demographics_updated',
    payload?: Partial<AnalyticsEvent>
  ): void {
    if (typeof window === 'undefined') return;
    try {
      const events = this.getEvents();
      const demo = this.getPlayerDemographics();
      const newEvent: AnalyticsEvent = {
        id: 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
        eventName: eventName as AnalyticsEvent['eventName'],
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
    } catch {
      // ignore
    }
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
