export type NodeType = 'start' | 'decision' | 'consequence' | 'climax';

export interface StoryChoice {
  id: string;
  label: string;
  nextNodeId: string;
  statPercent?: number; // e.g. 41 for 41%
  statCount?: number;
}

export interface StoryNode {
  id: string;
  type: NodeType;
  badge?: string; // e.g. "BATTERY: 2%", "DECISION 1", "CONSEQUENCE"
  badgeColor?: 'amber' | 'red' | 'emerald' | 'zinc';
  headline: string; // e.g. "YOU ARE JOSH." or "YOU OPEN THE PAPER."
  leadText?: string;
  bodyParagraphs?: string[];
  chatMessages?: Array<{
    sender: string;
    text: string;
    type?: 'incoming' | 'alert' | 'system';
  }>;
  highlightText?: string; // red alert line, e.g. "Battery: 1%."
  buttonText?: string; // e.g. "START", "CONTINUE", "UNCLE RWAMITI IS WAITING"
  nextNodeId?: string; // for linear steps (start, consequence, climax)
  choices?: StoryChoice[]; // for decision steps
  videoUrl?: string; // optional vertical video URL
  videoTitle?: string;
}

export interface RwamitiEnding {
  headline: string; // "INTERESTING."
  quoteLines: string[]; // ["You thought this was a story about a battery.", "I was watching what you did with the last 2% of your attention."]
  closingQuestion: string; // "If your battery had been 100%, would your judgment have been any better?"
  pollOptions: string[]; // ["YES", "NO", "HMMM..."]
}

export interface ComicPanelDialogue {
  character: string;
  text: string;
  side?: 'left' | 'right';
  bubbleType?: 'speech' | 'thought' | 'shout' | 'narration';
  characterRole?: string;
  avatarColor?: string;
}

export interface ComicPanelChoice {
  id: string;
  label: string;
  nextPanelId: string;
}

export interface ComicPanel {
  id: string;
  panelNumber: number;
  imageUrl?: string;
  caption?: string;
  dialogue?: ComicPanelDialogue[];
  soundEffect?: string; // onomatopoeia like "SKRRRRT!", "KABOOM!"
  settingDescription?: string;
  timeMarker?: string;
  dayMarker?: string;
  clashReason?: string;
  resolutionNote?: string;
  choices?: ComicPanelChoice[];
}

export interface ComicPage {
  pageNumber: number;
  label: string;
  image: string;
  caption?: string;
  keyMoments?: string[];
  timeMarker?: string;
}

export interface ComicBook {
  id: string;
  slug: string;
  issueNumber: string;
  title: string;
  series: string;
  description: string;
  pathLabel?: string;
  coverImage: string;
  pdfUrl?: string;
  pages: ComicPage[];
  releaseDate?: string;
  pageCount: number;
  readingTimeMinutes: number;
  tags: string[];
  panels: ComicPanel[];
  rwamitiWisdom: string;
  closingQuestion?: string;
  pollOptions?: string[];
  coverNote?: string;
  alternativeRoutes?: Array<{ title: string; description: string; slug: string }>;
  isCustom?: boolean;
}

export interface Episode {
  id: string; // e.g. "ep-001"
  number: string; // e.g. "001"
  title: string; // "2% BATTERY"
  subtitle?: string; // "What would you do?"
  teaser: string;
  category?: string;
  coverImage?: string;
  badge?: string; // "BATTERY: 2%"
  badgeColor?: 'amber' | 'red' | 'emerald' | 'zinc';
  isPremium: boolean;
  published: boolean;
  initialNodeId: string;
  nodes: Record<string, StoryNode>;
  rwamitiEnding: RwamitiEnding;
  recommendedNextEpisodeId?: string;
  sharePrompt?: string; // text used for WhatsApp Challenge
}

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  eventName:
    | 'episode_opened'
    | 'story_started'
    | 'choice_selected'
    | 'consequence_viewed'
    | 'climax_reached'
    | 'rwamiti_answered'
    | 'story_completed'
    | 'replay_clicked'
    | 'next_episode_clicked'
    | 'challenge_friend_clicked'
    | 'shared_link_visit'
    | 'subscription_screen_reached'
    | 'unlock_clicked'
    | 'payment_completed';
  episodeId?: string;
  nodeId?: string;
  choiceId?: string;
  choiceLabel?: string;
  metadata?: Record<string, any>;
}

export interface PlatformConfig {
  subscriptionPriceUgx: number; // default 5000
  subscriptionPriceLabel: string; // "UGX 5,000 / month"
  currency: string; // "UGX"
  defaultPaymentNumber: string; // e.g. "0772988640" (MTN & Airtel MoMo recipient, no spaces)
  merchantName?: string; // e.g. "Uncle Rwamiti / Your Move"
  showAggregateStats: boolean; // toggle choice percentage displays
  adminPin?: string; // legacy plaintext (deprecated)
  adminPinHash?: string; // SHA-256 hashed admin passcode
  adminPinSalt?: string; // cryptographic salt for admin passcode
  allowInstantFreeTrial: boolean;
}

export interface UserState {
  isPremium: boolean;
  subscribedAt?: number;
  completedEpisodeIds: string[];
  replayedEpisodeIds: string[];
  userChoices: Record<string, string>; // nodeId -> choiceId
  soundEnabled: boolean;
}

export type AgeBracket =
  | 'Under 13'
  | '13–17 (Teens)'
  | '18–24 (Youth)'
  | '25–34'
  | '35+'
  | 'Undisclosed';

export type GenderType = 'Female' | 'Male' | 'Other' | 'Prefer not to say';

export interface PlayerDemographics {
  ageBracket: AgeBracket;
  gender: GenderType;
  location: string;
  hasSubmitted?: boolean;
}

export interface GameSessionChoice {
  nodeId: string;
  choiceId: string;
  choiceLabel: string;
  timestamp: number;
}

export type StoryStage = 'opened' | 'first_choice' | 'mid_story' | 'climax' | 'completed';

export interface GameSessionRecord {
  id: string;
  visitorId: string;
  timestamp: number;
  dateStr: string;
  dateUganda?: string;
  dateIso?: string;
  episodeId: string;
  episodeNumber: string;
  episodeTitle: string;
  storyIdentifier?: string;
  ageBracket: string;
  gender: string;
  location: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  stageReached: StoryStage;
  dropOffNodeId?: string;
  dropOffNodeTitle?: string;
  choices: GameSessionChoice[];
  choicesCount: number;
  completed: boolean;
  completedAt?: string;
  isReplay: boolean;
  finalStoryChoice?: string;
  pollOption?: string;
  endingReachedTitle?: string;
  referralSource: string;
  referralChannel?: string;
  referralMedium?: string;
  countryOrTimezone: string;
  activePlayTimeSeconds?: number;
  playPacing?: 'Rapid (<15s)' | 'Quick (15–60s)' | 'Paced (>60s)';
  isTest?: boolean;
  testFlagReason?: string;
  attemptId?: string;
}

export interface VisitorRecord {
  visitorId: string;
  visitCount: number;
  firstVisit: number;
  lastVisit: number;
  isReturning: boolean;
  referralSource: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  countryOrTimezone: string;
  gamesPlayed: number;
  gamesCompleted: number;
  replaysCount: number;
  ageBracket?: string;
  gender?: string;
  location?: string;
}

