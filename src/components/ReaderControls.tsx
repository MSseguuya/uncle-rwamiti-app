import React, { useState, useEffect } from 'react';
import { StoryDatabaseService } from '../services/storyDatabaseService';
import { sound } from '../services/audio';

interface ReaderControlsProps {
  onSoundChange?: (enabled: boolean) => void;
}

export const ReaderControls: React.FC<ReaderControlsProps> = ({ onSoundChange }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StoryDatabaseService.getTheme());
  const [textSize, setTextSize] = useState<'standard' | 'large' | 'extra'>(() =>
    StoryDatabaseService.getTextSize()
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => !sound.getMuted());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.textSize = textSize;
  }, [textSize]);

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playTap();
    const next = theme === 'dark' ? 'light' : 'dark';
    StoryDatabaseService.setTheme(next);
    setTheme(next);
  };

  const cycleTextSize = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playTap();
    const sizes: Array<'standard' | 'large' | 'extra'> = ['standard', 'large', 'extra'];
    const next = sizes[(sizes.indexOf(textSize) + 1) % sizes.length];
    StoryDatabaseService.setTextSize(next);
    setTextSize(next);
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = !soundEnabled;
    sound.setMuted(!next);
    setSoundEnabled(next);
    if (next) sound.playTap();
    onSoundChange?.(next);
  };

  return (
    <span className="reader-controls">
      <button
        type="button"
        className="reader-toggle size-toggle"
        onClick={cycleTextSize}
        aria-label={`Text size ${textSize}. Change text size`}
        title={`Text size: ${textSize}`}
      >
        <span aria-hidden="true">Aa</span>
      </button>

      <button
        type="button"
        className="reader-toggle"
        onClick={toggleSound}
        aria-label={`Sound ${soundEnabled ? 'on' : 'off'}. Toggle sound`}
        aria-pressed={soundEnabled}
        title={`Sound ${soundEnabled ? 'on' : 'off'}`}
      >
        <span aria-hidden="true">{soundEnabled ? '♪' : '♪̸'}</span>
      </button>

      <button
        type="button"
        className="reader-toggle theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'white' : 'dark'} theme`}
        aria-pressed={theme === 'light'}
        title={`Switch to ${theme === 'dark' ? 'white' : 'dark'} theme`}
      >
        <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        <span className="theme-label">{theme === 'dark' ? 'WHITE' : 'DARK'}</span>
      </button>
    </span>
  );
};
