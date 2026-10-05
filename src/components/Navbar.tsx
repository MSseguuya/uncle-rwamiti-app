import React from 'react';
import { Volume2, VolumeX, Shield, Smartphone, Monitor, BookOpen, LogOut, Menu, MapPin } from 'lucide-react';
import { sound } from '../services/audio';
import { RwamitiPosterArt } from './RwamitiPosterArt';

interface NavbarProps {
  currentEpisodeTitle?: string;
  currentEpisodeNumber?: string;
  isDesktopPreview: boolean;
  onToggleDesktopPreview: () => void;
  onOpenDrawer: () => void;
  onOpenAdmin: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isPremiumUser: boolean;
  isAdminActive?: boolean;
  onLogoutAdmin?: () => void;
  currentView?: 'opening' | 'catalog' | 'story' | 'subscription';
  onNavigateView?: (view: 'opening' | 'catalog') => void;
  onTogglePremium?: () => void;
  onOpenDemographics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentEpisodeTitle,
  currentEpisodeNumber,
  isDesktopPreview,
  onToggleDesktopPreview,
  onOpenDrawer,
  onOpenAdmin,
  soundEnabled,
  onToggleSound,
  isPremiumUser,
  isAdminActive = false,
  onLogoutAdmin,
  currentView = 'story',
  onNavigateView,
  onTogglePremium,
  onOpenDemographics,
}) => {
  return (
    <header className="w-full bg-[#0d0e12] border-b border-zinc-800/80 px-4 py-2.5 flex items-center justify-between text-xs tracking-wider select-none shrink-0 z-30">
      {/* Brand & Episode info */}
      <div className="flex items-center gap-2.5 overflow-hidden">
        <button
          onClick={() => {
            sound.playTap();
            if (onNavigateView) {
              onNavigateView('opening');
            } else {
              onOpenDrawer();
            }
          }}
          className="flex items-center gap-2.5 text-zinc-300 hover:text-[#e5a93b] transition-colors group cursor-pointer"
          title="Return to Home Screen"
        >
          <RwamitiPosterArt variant="avatar" className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <div className="text-left hidden xs:block">
            <div className="text-[10px] uppercase font-semibold text-[#e5a93b] tracking-wider">
              WHAT WOULD YOU DO?
            </div>
            <div className="font-bold text-white text-xs truncate max-w-[140px] sm:max-w-[200px]">
              {currentView === 'story' && currentEpisodeNumber
                ? `EP ${currentEpisodeNumber} • ${currentEpisodeTitle}`
                : currentView === 'catalog'
                ? 'ALL STORIES'
                : 'UNCLE RWAMITI STORIES'}
            </div>
          </div>
        </button>

        <span className="bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>100% FREE ACCESS</span>
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Demographic / Region button */}
        {onOpenDemographics && (
          <button
            onClick={() => {
              sound.playTap();
              onOpenDemographics();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-[#e5a93b] border border-zinc-800 transition-colors cursor-pointer text-[11px] font-bold"
            title="Audience Demographics & District Info"
          >
            <MapPin className="w-3.5 h-3.5 text-[#e5a93b]" />
            <span className="hidden sm:inline">My Region</span>
          </button>
        )}

        {/* Stories Catalog Button */}
        {onNavigateView && (
          <button
            onClick={() => {
              sound.playTap();
              onNavigateView('catalog');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              currentView === 'catalog'
                ? 'bg-[#e5a93b]/20 text-[#e5a93b] border-[#e5a93b]/50'
                : 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title="Browse All Stories"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#e5a93b]" />
            <span className="text-[11px] font-bold">Stories</span>
          </button>
        )}

        {/* Episode Drawer List Button */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenDrawer();
          }}
          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
          title="Open Episode List Drawer"
        >
          <Menu className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-[11px] font-bold hidden xs:inline">Episodes</span>
        </button>

        {/* Device frame preview toggle for desktop screen */}
        <button
          onClick={onToggleDesktopPreview}
          className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
          title={isDesktopPreview ? "Switch to Fullscreen Layout" : "Switch to Mobile Device Frame"}
        >
          {isDesktopPreview ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span className="text-[11px]">{isDesktopPreview ? "Fit Screen" : "Mobile Frame"}</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => {
            onToggleSound();
            sound.playTap();
          }}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              : 'bg-zinc-900 text-zinc-500 border-zinc-800/60'
          }`}
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Admin CMS Badge & Return - ONLY rendered for active administrator sessions */}
        {isAdminActive && (
          <div className="flex items-center gap-1 pl-1 border-l border-zinc-800">
            <button
              onClick={() => {
                sound.playTap();
                onOpenAdmin();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#e5a93b]/20 hover:bg-[#e5a93b]/30 text-[#e5a93b] border border-[#e5a93b]/50 transition-colors cursor-pointer"
              title="Return to Admin CMS Console"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">Admin CMS</span>
            </button>
            {onLogoutAdmin && (
              <button
                onClick={() => {
                  sound.playTap();
                  onLogoutAdmin();
                }}
                className="p-1.5 rounded-lg bg-zinc-850 hover:bg-red-500/20 hover:text-red-400 text-zinc-400 border border-zinc-800 transition-colors cursor-pointer"
                title="Log Out of Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
