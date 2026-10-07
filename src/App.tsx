import React, { useState, useEffect } from 'react';
import { Episode, PlatformConfig, UserState } from './types';
import { StorageService } from './services/storage';
import { FirestoreDataService } from './services/firestoreData';
import { AnalyticsService } from './services/analytics';
import { AdminAuthService } from './services/adminAuth';
import { sound } from './services/audio';
import {
  CatalogStory,
  StoryData,
  StoryDatabaseService,
} from './services/storyDatabaseService';
import { PlatformHeader, MainNavTab } from './components/PlatformHeader';
import { StreamHero } from './components/StreamHero';
import { TeenStoriesSection } from './components/TeenStoriesSection';
import { StreamRow } from './components/StreamRow';
import { SearchStoriesView } from './components/SearchStoriesView';
import { MyListView } from './components/MyListView';
import { StorySceneReader } from './components/StorySceneReader';
import { StoryDetailModal } from './components/StoryDetailModal';
import { ShareDilemmaModal } from './components/ShareDilemmaModal';
import { BottomNav } from './components/BottomNav';
import { AuthorFooter } from './components/AuthorFooter';
import { AdminCMS } from './components/AdminCMS';
import { DemographicsModal } from './components/DemographicsModal';

export default function App() {
  // Catalog & Stories Data
  const [catalog] = useState<CatalogStory[]>(() => StoryDatabaseService.getCatalog());
  const featuredStory = StoryDatabaseService.getFeaturedStory();
  const teenStories = StoryDatabaseService.getTeenStories();
  const adultStories = StoryDatabaseService.getAdultStories();

  // Navigation State
  const [activeTab, setActiveTab] = useState<MainNavTab>('browse');
  const [activeScreen, setActiveScreen] = useState<'main' | 'reader'>('main');
  const [currentStorySlug, setCurrentStorySlug] = useState<string>('the-match-you-missed');

  // Modals & Overlays
  const [detailModalStory, setDetailModalStory] = useState<CatalogStory | null>(null);
  const [detailStoryData, setDetailStoryData] = useState<StoryData | null>(null);
  const [shareStory, setShareStory] = useState<CatalogStory | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(() => StoryDatabaseService.getSavedSlugs());

  // In-progress continuing stories
  const [continuingStories, setContinuingStories] = useState<CatalogStory[]>([]);

  // Admin & Firestore State
  const [episodes, setEpisodes] = useState<Episode[]>(() => StorageService.getEpisodes());
  const [config, setConfig] = useState<PlatformConfig>(() => StorageService.getConfig());
  const [userState] = useState<UserState>(() => StorageService.getUserState());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState<boolean>(() => AdminAuthService.isSessionActive());
  const [isDemographicsOpen, setIsDemographicsOpen] = useState(false);

  // Sync Continuing Stories
  const refreshContinuingStories = () => {
    const progressMap = StoryDatabaseService.getAllProgress();
    const continuing = catalog.filter((s) => {
      const p = progressMap[s.slug];
      return p && !p.completed && p.node !== 'opening';
    });
    setContinuingStories(continuing);
  };

  useEffect(() => {
    refreshContinuingStories();
  }, [activeScreen, activeTab]);

  // Firestore real-time synchronization & Visitor Tracking
  useEffect(() => {
    // Record real visitor session (referral, device, unique visitor ID)
    AnalyticsService.recordVisitorVisit();

    FirestoreDataService.init(
      (remoteEpisodes) => {
        const sanitized = remoteEpisodes.map((ep) => ({
          ...ep,
          isPremium: false,
        }));
        setEpisodes(sanitized);
      },
      (remoteConfig) => {
        setConfig(remoteConfig);
      }
    );
  }, []);

  // Admin session sync & URL / shortcut listener
  useEffect(() => {
    const handleSessionChange = () => {
      setIsAdminActive(AdminAuthService.isSessionActive());
    };
    const handleOpenAdminEvent = () => {
      sound.playTap();
      setIsAdminOpen(true);
    };

    window.addEventListener('rwamiti-admin-session-change', handleSessionChange);
    window.addEventListener('open-admin-cms', handleOpenAdminEvent);

    // Keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        sound.playTap();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // URL route check for ?admin=1 or #admin
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === '1' || params.get('admin') === 'true' || window.location.hash === '#admin' || params.get('admin_reset')) {
        setIsAdminOpen(true);
        try {
          params.delete('admin');
          const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
          window.history.replaceState({}, '', newUrl);
        } catch {
          // ignore
        }
      }

      // Check ?story=slug in query parameters
      const urlStory = params.get('story');
      if (urlStory) {
        const found = catalog.find((s) => s.slug === urlStory);
        if (found) {
          handlePlayStory(found.slug);
        }
      }
    }

    return () => {
      window.removeEventListener('rwamiti-admin-session-change', handleSessionChange);
      window.removeEventListener('open-admin-cms', handleOpenAdminEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [catalog]);

  const handlePlayStory = (slug: string) => {
    sound.playTap();
    setCurrentStorySlug(slug);
    setDetailModalStory(null);
    setActiveScreen('reader');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenMoreInfo = (story: CatalogStory) => {
    sound.playTap();
    setDetailModalStory(story);
    const data = StoryDatabaseService.getStory(story.slug);
    setDetailStoryData(data);
  };

  const handleOpenShare = (story: CatalogStory) => {
    sound.playTap();
    setShareStory(story);
    setIsShareOpen(true);
  };

  const handleToggleSave = (slug: string) => {
    StoryDatabaseService.toggleSaved(slug);
    setSavedSlugs(StoryDatabaseService.getSavedSlugs());
  };

  const savedStoryList = catalog.filter((s) => savedSlugs.has(s.slug));

  // If in Reader view, render the full StorySceneReader
  if (activeScreen === 'reader') {
    const currentStoryMeta =
      StoryDatabaseService.findCatalogStory(currentStorySlug) ||
      catalog.find((s) => s.slug === currentStorySlug) ||
      featuredStory;
    const currentStoryData = StoryDatabaseService.getStory(currentStorySlug) || {
      id: currentStorySlug,
      title: currentStoryMeta.title,
      image: currentStoryMeta.cover,
      category: currentStoryMeta.category,
      nodes: {
        opening: {
          key: 'opening',
          title: currentStoryMeta.title,
          summary: currentStoryMeta.description,
          paragraphs: [currentStoryMeta.description],
          choices: [],
          is_ending: true,
        },
      },
    };

    return (
      <>
        <StorySceneReader
          storyMeta={currentStoryMeta}
          storyData={currentStoryData}
          onBackToStories={() => {
            setActiveScreen('main');
            refreshContinuingStories();
          }}
          onShare={handleOpenShare}
        />

        {/* Share Dilemma Modal */}
        <ShareDilemmaModal
          story={shareStory}
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />
      </>
    );
  }

  // Curated adult stories for primary row
  const primaryAdultSlugs = [
    'empty-chair',
    'the-rehearsal',
    'red-ledger',
    'the-donation',
    'borrowed-name',
    'wedding-guest',
  ];
  const primaryAdultStories = primaryAdultSlugs
    .map((slug) => adultStories.find((s) => s.slug === slug))
    .filter((s): s is CatalogStory => !!s);
  const remainingAdultStories = adultStories.filter((s) => !primaryAdultSlugs.includes(s.slug));

  return (
    <main className="platform min-h-screen">
      {/* Topbar / Header */}
      <PlatformHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        isAdminActive={isAdminActive}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Tab Views */}
      {activeTab === 'browse' && (
        <>
          {/* Featured Stream Hero: "The Match You Missed" */}
          <StreamHero
            story={featuredStory}
            onPlay={handlePlayStory}
            onMoreInfo={handleOpenMoreInfo}
          />

          {/* Teen Stories Section */}
          <TeenStoriesSection
            stories={teenStories}
            onPlay={handlePlayStory}
            onMoreInfo={handleOpenMoreInfo}
          />

          {/* Continue Your Story (if in-progress stories exist) */}
          {continuingStories.length > 0 && (
            <StreamRow
              title="Continue your story"
              stories={continuingStories}
              onSelectStory={handleOpenMoreInfo}
            />
          )}

          {/* Adult Stories Rows */}
          <StreamRow
            title="Adult Stories"
            stories={primaryAdultStories}
            onSelectStory={handleOpenMoreInfo}
          />

          <StreamRow
            title="More adult stories"
            stories={remainingAdultStories}
            onSelectStory={handleOpenMoreInfo}
          />
        </>
      )}

      {activeTab === 'search' && (
        <SearchStoriesView
          catalog={catalog}
          onSelectStory={handleOpenMoreInfo}
        />
      )}

      {activeTab === 'list' && (
        <MyListView
          savedStories={savedStoryList}
          onSelectStory={handleOpenMoreInfo}
          onBrowse={() => setActiveTab('browse')}
        />
      )}

      {/* Author Footer (author..contact..publisher) */}
      <AuthorFooter
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminActive={isAdminActive}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
      />

      {/* Story Detail / More Info Modal */}
      <StoryDetailModal
        story={detailModalStory}
        storyData={detailStoryData}
        isOpen={!!detailModalStory}
        onClose={() => setDetailModalStory(null)}
        onPlay={handlePlayStory}
        onShare={handleOpenShare}
        isSaved={detailModalStory ? savedSlugs.has(detailModalStory.slug) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Share Dilemma Modal */}
      <ShareDilemmaModal
        story={shareStory}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Demographics Survey Modal (optional) */}
      <DemographicsModal
        isOpen={isDemographicsOpen}
        onClose={() => setIsDemographicsOpen(false)}
        onSubmitDemographics={() => {
          setIsDemographicsOpen(false);
        }}
      />

      {/* Admin CMS & Analytics Console */}
      <AdminCMS
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        episodes={episodes}
        onEpisodesChange={(newEpisodes) => {
          setEpisodes(newEpisodes);
          StorageService.saveEpisodes(newEpisodes);
        }}
        config={config}
        onConfigChange={(newConfig) => {
          setConfig(newConfig);
          StorageService.saveConfig(newConfig);
        }}
        onPlayEpisode={(epId) => {
          setIsAdminOpen(false);
          const found =
            StoryDatabaseService.findCatalogStory(epId) ||
            catalog.find((c) => c.slug === epId || c.slug.includes(epId));
          if (found) {
            handlePlayStory(found.slug);
          } else {
            handlePlayStory(epId);
          }
        }}
      />
    </main>
  );
}
