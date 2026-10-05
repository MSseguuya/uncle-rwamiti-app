import React from 'react';
import { MainNavTab } from './PlatformHeader';
import { sound } from '../services/audio';

interface BottomNavProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <button
        type="button"
        className={activeTab === 'browse' ? 'active' : ''}
        onClick={() => {
          sound.playTap();
          onSelectTab('browse');
        }}
      >
        <span>⌂</span>
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
        <span>▤</span>
        Stories
      </button>

      <button
        type="button"
        className=""
        onClick={() => {
          sound.playTap();
          onSelectTab('search');
        }}
      >
        <span>⌕</span>
        Search
      </button>

      <button
        type="button"
        className={activeTab === 'list' ? 'active' : ''}
        onClick={() => {
          sound.playTap();
          onSelectTab('list');
        }}
      >
        <span>＋</span>
        My List
      </button>
    </nav>
  );
};
