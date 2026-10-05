import React from 'react';
import { ReaderControls } from './ReaderControls';
import { sound } from '../services/audio';

export type MainNavTab = 'browse' | 'search' | 'list';

interface PlatformHeaderProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  isAdminActive: boolean;
  onOpenAdmin: () => void;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  activeTab,
  onSelectTab,
  isAdminActive,
  onOpenAdmin,
}) => {
  return (
    <header className="platform-head">
      <button
        type="button"
        className="platform-logo"
        onClick={() => {
          sound.playTap();
          onSelectTab('browse');
        }}
        aria-label="Uncle Rwamiti home"
      >
        <img decoding="async" src="rwamiti.jpg" alt="Uncle Rwamiti" />
        <span>UNCLE RWAMITI</span>
      </button>

      <nav className="desktop-nav" aria-label="Main navigation">
        <button
          type="button"
          className={activeTab === 'browse' ? 'active' : ''}
          onClick={() => {
            sound.playTap();
            onSelectTab('browse');
          }}
        >
          Home
        </button>
        <button
          type="button"
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => {
            sound.playTap();
            onSelectTab('search');
          }}
        >
          Stories
        </button>
        <button
          type="button"
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => {
            sound.playTap();
            onSelectTab('list');
          }}
        >
          My List
        </button>
      </nav>

      <span className="platform-actions flex items-center gap-3">
        <ReaderControls />

        <button
          type="button"
          className={`header-account text-xs font-mono font-bold px-3 py-2 rounded border transition-colors ${
            isAdminActive
              ? 'border-emerald-500/60 text-emerald-400 bg-emerald-950/30'
              : 'border-[var(--line,rgba(255,255,255,0.2))] text-[var(--text,#f5f3ed)] hover:border-[var(--yellow,#f4c900)]'
          }`}
          onClick={() => {
            sound.playTap();
            onOpenAdmin();
          }}
          title="Open Admin Console & Analytics"
        >
          {isAdminActive ? '● ADMIN' : 'ADMIN CONSOLE'}
        </button>
      </span>
    </header>
  );
};
