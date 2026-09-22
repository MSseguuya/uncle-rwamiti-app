import React, { useState, useEffect } from 'react';
import { Episode, PlatformConfig, UserState } from './types';
import { StorageService } from './services/storage';
import { FirestoreDataService } from './services/firestoreData';
import { AnalyticsService } from './services/analytics';
import { sound } from './services/audio';
import { Navbar } from './components/Navbar';
import { MobileFrame } from './components/MobileFrame';
import { OpeningScreen } from './components/OpeningScreen';
import { StoryCatalog } from './components/StoryCatalog';
import { StoryPlayer } from './components/StoryPlayer';
import { EpisodeDrawer } from './components/EpisodeDrawer';
import { SubscriptionPage } from './components/SubscriptionPage';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ShareModal } from './components/ShareModal';
import { AdminCMS } from './components/AdminCMS';
import { AdminAuthService } from './services/adminAuth';

type AppView = 'opening' | 'catalog' | 'story' | 'subscription';

export default function App() {
  const [episodes, setEp] = useState<Episode[]>(() => StorageService.getEpisodes());
  const [config, setConfig] = useState<PlatformConfig>(() => StorageService.getConfig());
  const [userState, setUserState] = useState<UserState>(() => StorageService.getUserState());

  // View state: 'opening' -> 'catalog' -> 'story'
  const [currentView, setCurrentView] = useState<AppView>('opening');

  // Navigation & current story
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string>('ep-001');

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState<boolean>(() => AdminAuthService.isSessionActive());
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [subscriptionTargetEpisode, setSubscriptionTargetEpisode] = useState<Episode | null>(null);

  // Desktop smartphone frame preview toggle
  const [isDesktopPreview, setIsDesktopPreview] = useState(true);

  // Sound sync
  useEffect(() => {
    sound.setMuted(!userState.soundEnabled);
  }, [userState.soundEnabled]);

  // Firestore real-time synchronization
  useEffect(() => {
    FirestoreDataService.init((remoteEpisodes) => {
      const sanitized = remoteEpisodes.map((ep) => {
        const num = parseInt(ep.number, 10);
        return {
          ...ep,
          isPremium: !isNaN(num) ? num >= 6 : ep.isPremium,
        };
      });
      setEp(sanitized);
    });
  }, []);

  // Admin session sync
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

    // Keyboard shortcut for authorized administrators: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        sound.playTap();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Secure Admin URL Route check: ?admin=1, ?admin=true, or #admin
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === '1' || params.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminOpen(true);
        // Clean URL to prevent exposing administrative entry in browser history
        try {
          params.delete('admin');
          const newSearch = params.toString() ? `?${params.toString()}` : '';
          const newUrl = `${window.location.pathname}${newSearch}`;
          window.history.replaceState({}, document.title, newUrl);
        } catch {
          // Ignore
        }
      }
    }

    return () => {
      window.removeEventListener('rwamiti-admin-session-change', handleSessionChange);
      window.removeEventListener('open-admin-cms', handleOpenAdminEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle direct URL parameter on initial load (Acceptance Test 1 & Requirement 2)
  // E.g. https://.../?episode=001 or ?episode=3&ref=challenge
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const epParam = params.get('episode');
    const refParam = params.get('ref');

    if (epParam) {
      // Look up by id or number (e.g. "001", "1", "ep-001")
      const found = episodes.find(
        (e) =>
          e.id.toLowerCase() === epParam.toLowerCase() ||
          e.number === epParam ||
          e.number === epParam.padStart(3, '0')
      );
      if (found) {
        const num = parseInt(found.number, 10);
        const isEpPremium = !isNaN(num) ? num >= 6 : !!found.isPremium;
        if (isEpPremium && !userState.isPremium) {
          setSubscriptionTargetEpisode(found);
          setCurrentView('subscription');
        } else {
          setCurrentEpisodeId(found.id);
          setCurrentView('story');
        }
        if (refParam) {
          AnalyticsService.track('shared_link_visit', {
            episodeId: found.id,
            metadata: { ref: refParam },
          });
        }
      }
    }
  }, [episodes, userState.isPremium]);

  // Current active episode
  const currentEpisode =
    episodes.find((e) => e.id === currentEpisodeId) || episodes[0] || null;

  // Published counts
  const publishedEpisodes = episodes.filter((e) => e.published !== false);
  const freeEpisodesCount = publishedEpisodes.filter((e) => !e.isPremium).length;

  // Toggle sound
  const handleToggleSound = () => {
    const next = !userState.soundEnabled;
    const updated = { ...userState, soundEnabled: next };
    setUserState(updated);
    StorageService.saveUserState(updated);
  };

  // Handle payment success (Ugandan Mobile Money)
  const handlePaymentSuccess = () => {
    const updated = { ...userState, isPremium: true, subscribedAt: Date.now() };
    setUserState(updated);
    StorageService.saveUserState(updated);
    // If user paid to unlock a specific episode, navigate to it now
    if (subscriptionTargetEpisode) {
      setCurrentEpisodeId(subscriptionTargetEpisode.id);
      setCurrentView('story');
    } else {
      setCurrentView('catalog');
    }
  };

  // Toggle user premium status for quick testing / paywall verification
  const handleTogglePremium = () => {
    const nextPremium = !userState.isPremium;
    const updated = { ...userState, isPremium: nextPremium };
    setUserState(updated);
    StorageService.saveUserState(updated);
  };

  // Handle story completion
  const handleStoryCompleted = (episodeId: string) => {
    if (!userState.completedEpisodeIds.includes(episodeId)) {
      const updated = {
        ...userState,
        completedEpisodeIds: [...userState.completedEpisodeIds, episodeId],
      };
      setUserState(updated);
      StorageService.saveUserState(updated);
    }
  };

  // Handle navigating to next episode seamlessly
  const handleNextEpisode = (targetEpisodeId: string) => {
    sound.playTap();
    AnalyticsService.track('next_episode_clicked', {
      episodeId: currentEpisodeId,
      metadata: { target: targetEpisodeId },
    });

    const targetEp = episodes.find(
      (e) => e.id === targetEpisodeId || e.number === targetEpisodeId
    );

    if (targetEp) {
      const num = parseInt(targetEp.number, 10);
      const isEpPremium = !isNaN(num) ? num >= 6 : !!targetEp.isPremium;
      if (isEpPremium && !userState.isPremium) {
        // Locked behind YOUR MOVE+
        setSubscriptionTargetEpisode(targetEp);
        AnalyticsService.track('subscription_screen_reached', { episodeId: targetEp.id });
        setIsSubscriptionOpen(true);
      } else {
        setCurrentEpisodeId(targetEp.id);
        setCurrentView('story');
      }
    } else {
      // If reached the end of list, open catalog
      setCurrentView('catalog');
    }
  };

  // Open subscription page
  const handleOpenSubscription = (ep?: Episode | null) => {
    if (ep) {
      setSubscriptionTargetEpisode(ep);
    }
    AnalyticsService.track('subscription_screen_reached', { episodeId: ep?.id });
    setIsDrawerOpen(false);
    setIsSubscriptionOpen(false);
    setCurrentView('subscription');
  };

  // Select an episode from Catalog or Drawer
  const handleSelectEpisode = (epId: string) => {
    const ep = episodes.find((e) => e.id === epId);
    if (!ep) return;

    const num = parseInt(ep.number, 10);
    const isEpPremium = !isNaN(num) ? num >= 6 : !!ep.isPremium;
    if (isEpPremium && !userState.isPremium) {
      handleOpenSubscription(ep);
    } else {
      setCurrentEpisodeId(ep.id);
      setCurrentView('story');
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-zinc-100 flex flex-col font-sans antialiased select-none">
      {/* Platform Navigation Bar */}
      <Navbar
        currentEpisodeTitle={currentView === 'story' ? currentEpisode?.title : undefined}
        currentEpisodeNumber={currentView === 'story' ? currentEpisode?.number : undefined}
        isDesktopPreview={isDesktopPreview}
        onToggleDesktopPreview={() => setIsDesktopPreview((prev) => !prev)}
        onOpenDrawer={() => {
          sound.playTap();
          setIsDrawerOpen(true);
        }}
        onOpenAdmin={() => {
          sound.playTap();
          setIsAdminOpen(true);
        }}
        soundEnabled={userState.soundEnabled}
        onToggleSound={handleToggleSound}
        isPremiumUser={userState.isPremium}
        isAdminActive={isAdminActive}
        onLogoutAdmin={() => {
          AdminAuthService.clearSession();
          setIsAdminActive(false);
        }}
        currentView={currentView}
        onNavigateView={(view) => setCurrentView(view)}
        onTogglePremium={handleTogglePremium}
      />

      {/* Main Viewport (Mobile or Framed) */}
      <MobileFrame isDesktopPreview={isDesktopPreview}>
        {/* VIEW 1: OPENING SCREEN */}
        {currentView === 'opening' && (
          <OpeningScreen
            onStart={() => setCurrentView('catalog')}
            totalEpisodesCount={publishedEpisodes.length}
            freeEpisodesCount={freeEpisodesCount}
          />
        )}

        {/* VIEW 2: ALL STORIES CATALOG */}
        {currentView === 'catalog' && (
          <StoryCatalog
            episodes={episodes}
            onSelectEpisode={handleSelectEpisode}
            onOpenSubscription={(ep) => handleOpenSubscription(ep)}
            isPremiumUser={userState.isPremium}
            completedEpisodeIds={userState.completedEpisodeIds}
            onBackToOpening={() => setCurrentView('opening')}
            onTogglePremium={handleTogglePremium}
          />
        )}

        {/* VIEW 3: INTERACTIVE STORY PLAYER */}
        {currentView === 'story' && currentEpisode && (
          <StoryPlayer
            episode={currentEpisode}
            onNextEpisode={handleNextEpisode}
            onOpenShare={() => {
              sound.playTap();
              setIsShareOpen(true);
            }}
            onOpenSubscription={() => handleOpenSubscription(currentEpisode)}
            isPremiumUser={userState.isPremium}
            showAggregateStats={config.showAggregateStats}
            onStoryCompleted={handleStoryCompleted}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}

        {/* VIEW 4: SUBSCRIPTION & UNLOCK PAGE */}
        {currentView === 'subscription' && (
          <SubscriptionPage
            targetEpisode={subscriptionTargetEpisode}
            priceUgx={config.subscriptionPriceUgx || 5000}
            recipientNumber={config.defaultPaymentNumber || '0772988640'}
            merchantName={config.merchantName || 'Uncle Rwamiti / Your Move'}
            onPaymentSuccess={handlePaymentSuccess}
            onBackToCatalog={() => setCurrentView('catalog')}
          />
        )}
      </MobileFrame>

      {/* Episode Navigation Drawer */}
      <EpisodeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        episodes={episodes}
        currentEpisodeId={currentEpisodeId}
        onSelectEpisode={(epId) => {
          handleSelectEpisode(epId);
        }}
        isPremiumUser={userState.isPremium}
        onOpenSubscription={() => {
          handleOpenSubscription(currentEpisode);
        }}
        completedEpisodeIds={userState.completedEpisodeIds}
      />

      {/* Ugandan Mobile Money Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        priceUgx={config.subscriptionPriceUgx || 5000}
        recipientNumber={config.defaultPaymentNumber || '0772988640'}
        merchantName={config.merchantName || 'Uncle Rwamiti / Your Move'}
        onPaymentSuccess={handlePaymentSuccess}
        episodeTitle={subscriptionTargetEpisode?.title || currentEpisode?.title}
      />

      {/* WhatsApp & Social Challenge Share Modal */}
      {currentEpisode && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          episode={currentEpisode}
        />
      )}

      {/* Administrator Console & CMS */}
      <AdminCMS
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        episodes={episodes}
        onEpisodesChange={(newEpisodes) => setEp(newEpisodes)}
        config={config}
        onConfigChange={(newConfig) => setConfig(newConfig)}
        onPlayEpisode={(epId) => {
          setCurrentEpisodeId(epId);
          setCurrentView('story');
        }}
      />
    </div>
  );
}
