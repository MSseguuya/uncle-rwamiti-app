import React from 'react';

interface MobileFrameProps {
  isDesktopPreview: boolean;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  isDesktopPreview,
  children,
}) => {
  if (!isDesktopPreview) {
    return (
      <div className="w-full flex-1 flex flex-col bg-[#0b0c0f]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-0 md:p-6 bg-[#07080a] min-h-[calc(100vh-45px)] overflow-y-auto">
      {/* Smartphone Device Shell for desktop testing */}
      <div className="w-full max-w-[430px] min-h-[820px] bg-[#0c0d11] rounded-none md:rounded-[42px] border-0 md:border-[10px] border-[#22242c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden ring-1 ring-zinc-800/80">
        {/* Top Speaker / Camera Notch on desktop */}
        <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 text-[11px] text-zinc-500 font-mono select-none">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black rounded-full mx-auto" />
          <span>5G • 100%</span>
        </div>

        {/* Inner Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#0c0d11]">
          {children}
        </div>

        {/* Bottom Home Bar Indicator on desktop */}
        <div className="hidden md:flex justify-center pb-2 pt-1">
          <div className="w-32 h-1 bg-zinc-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
