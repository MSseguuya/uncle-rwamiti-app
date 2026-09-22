import { AnalyticsEvent } from '../types';

const ANALYTICS_KEY = 'rwamiti_analytics_events_v1';

// Seed representative baseline data to demonstrate live charts & drop-offs
const SEED_EVENTS: AnalyticsEvent[] = [
  // Episode 1 events
  { id: 'se-1', timestamp: Date.now() - 3600 * 1000 * 48, eventName: 'shared_link_visit', episodeId: 'ep-001' },
  { id: 'se-2', timestamp: Date.now() - 3600 * 1000 * 46, eventName: 'episode_opened', episodeId: 'ep-001' },
  { id: 'se-3', timestamp: Date.now() - 3600 * 1000 * 45, eventName: 'story_started', episodeId: 'ep-001', nodeId: 'node-start' },
  { id: 'se-4', timestamp: Date.now() - 3600 * 1000 * 44, eventName: 'choice_selected', episodeId: 'ep-001', nodeId: 'node-decision-1', choiceId: 'c1', choiceLabel: 'Tomorrow’s Exam Paper' },
  { id: 'se-5', timestamp: Date.now() - 3600 * 1000 * 43, eventName: 'story_completed', episodeId: 'ep-001' },
  { id: 'se-6', timestamp: Date.now() - 3600 * 1000 * 42, eventName: 'challenge_friend_clicked', episodeId: 'ep-001' },
  { id: 'se-7', timestamp: Date.now() - 3600 * 1000 * 30, eventName: 'episode_opened', episodeId: 'ep-002' },
  { id: 'se-8', timestamp: Date.now() - 3600 * 1000 * 29, eventName: 'story_started', episodeId: 'ep-002' },
  { id: 'se-9', timestamp: Date.now() - 3600 * 1000 * 28, eventName: 'choice_selected', episodeId: 'ep-002', choiceId: 'c2_2', choiceLabel: 'Fake swallow & pocket it' },
  { id: 'se-10', timestamp: Date.now() - 3600 * 1000 * 27, eventName: 'story_completed', episodeId: 'ep-002' },
  { id: 'se-11', timestamp: Date.now() - 3600 * 1000 * 20, eventName: 'episode_opened', episodeId: 'ep-003' },
  { id: 'se-12', timestamp: Date.now() - 3600 * 1000 * 19, eventName: 'story_started', episodeId: 'ep-003' },
  { id: 'se-13', timestamp: Date.now() - 3600 * 1000 * 18, eventName: 'choice_selected', episodeId: 'ep-003', choiceId: 'c3_b', choiceLabel: 'Wait for Mum' },
  { id: 'se-14', timestamp: Date.now() - 3600 * 1000 * 17, eventName: 'story_completed', episodeId: 'ep-003' },
  { id: 'se-15', timestamp: Date.now() - 3600 * 1000 * 12, eventName: 'subscription_screen_reached', episodeId: 'ep-006' },
  { id: 'se-16', timestamp: Date.now() - 3600 * 1000 * 11, eventName: 'unlock_clicked', episodeId: 'ep-006' },
  { id: 'se-17', timestamp: Date.now() - 3600 * 1000 * 10, eventName: 'payment_completed', episodeId: 'ep-006', metadata: { provider: 'MTN Mobile Money', amount: 5000 } },
];

export class AnalyticsService {
  static getEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return SEED_EVENTS;
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (!stored) {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(SEED_EVENTS));
        return SEED_EVENTS;
      }
      return JSON.parse(stored);
    } catch {
      return SEED_EVENTS;
    }
  }

  static track(eventName: AnalyticsEvent['eventName'], payload?: {
    episodeId?: string;
    nodeId?: string;
    choiceId?: string;
    choiceLabel?: string;
    metadata?: Record<string, any>;
  }): void {
    if (typeof window === 'undefined') return;
    try {
      const events = this.getEvents();
      const newEvent: AnalyticsEvent = {
        id: 'evt_' + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        eventName,
        episodeId: payload?.episodeId,
        nodeId: payload?.nodeId,
        choiceId: payload?.choiceId,
        choiceLabel: payload?.choiceLabel,
        metadata: payload?.metadata,
      };
      events.push(newEvent);
      // Keep last 1000 events
      const trimmed = events.slice(-1000);
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to log analytics:', e);
    }
  }

  static getSummary(filterEpisodeId?: string) {
    const events = this.getEvents().filter((e) => {
      if (filterEpisodeId && filterEpisodeId !== 'all') {
        return e.episodeId === filterEpisodeId;
      }
      return true;
    });

    const totalOpens = events.filter((e) => e.eventName === 'episode_opened').length;
    const totalStarts = events.filter((e) => e.eventName === 'story_started').length;
    const totalChoices = events.filter((e) => e.eventName === 'choice_selected').length;
    const totalCompletions = events.filter((e) => e.eventName === 'story_completed').length;
    const totalReplays = events.filter((e) => e.eventName === 'replay_clicked').length;
    const totalNexts = events.filter((e) => e.eventName === 'next_episode_clicked').length;
    const totalChallenges = events.filter((e) => e.eventName === 'challenge_friend_clicked').length;
    const totalPaywallViews = events.filter((e) => e.eventName === 'subscription_screen_reached').length;
    const totalPayments = events.filter((e) => e.eventName === 'payment_completed').length;

    // Calculate choice distributions
    const choiceCounts: Record<string, { label: string; count: number }> = {};
    events
      .filter((e) => e.eventName === 'choice_selected' && e.choiceLabel)
      .forEach((e) => {
        const key = `${e.nodeId || 'unknown'}:${e.choiceLabel}`;
        if (!choiceCounts[key]) {
          choiceCounts[key] = { label: e.choiceLabel || 'Choice', count: 0 };
        }
        choiceCounts[key].count += 1;
      });

    return {
      totalOpens,
      totalStarts,
      totalChoices,
      totalCompletions,
      totalReplays,
      totalNexts,
      totalChallenges,
      totalPaywallViews,
      totalPayments,
      completionRate: totalStarts > 0 ? Math.round((totalCompletions / totalStarts) * 100) : 0,
      choiceCounts: Object.values(choiceCounts),
      rawCount: events.length,
    };
  }

  static exportCSV(): string {
    const events = this.getEvents();
    const headers = ['id', 'timestamp', 'date', 'eventName', 'episodeId', 'nodeId', 'choiceLabel'];
    const rows = events.map((e) => [
      e.id,
      e.timestamp,
      new Date(e.timestamp).toISOString(),
      e.eventName,
      e.episodeId || '',
      e.nodeId || '',
      `"${(e.choiceLabel || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  static clearAnalytics(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ANALYTICS_KEY);
  }
}
