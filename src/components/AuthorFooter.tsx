import React from 'react';
import { sound } from '../services/audio';

interface AuthorFooterProps {
  onOpenAdmin: () => void;
  isAdminActive?: boolean;
}

export const AuthorFooter: React.FC<AuthorFooterProps> = ({ onOpenAdmin, isAdminActive }) => {
  return (
    <footer className="w-full py-8 pb-24 sm:pb-14 flex items-center justify-center text-center">
      <div className="text-xs sm:text-[13px] font-mono tracking-wider text-zinc-500 flex items-center justify-center gap-2 select-none">
        <a
          href="https://peterospaths.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-100 transition-colors underline-offset-4 hover:underline"
        >
          author
        </a>
        <span className="text-zinc-600">..</span>
        <a
          href="https://peterospaths.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-zinc-100 transition-colors underline-offset-4 hover:underline"
        >
          contact
        </a>
        <span className="text-zinc-600">..</span>
        <button
          type="button"
          onClick={() => {
            sound.playTap();
            onOpenAdmin();
          }}
          className="text-zinc-400 hover:text-zinc-100 transition-colors underline-offset-4 hover:underline cursor-pointer bg-transparent border-0 p-0 font-inherit inline-flex items-center gap-1.5"
          title="Publisher & Administrator Access"
        >
          <span>publisher</span>
          {isAdminActive && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50"
              title="Admin session active"
            />
          )}
        </button>
      </div>
    </footer>
  );
};
