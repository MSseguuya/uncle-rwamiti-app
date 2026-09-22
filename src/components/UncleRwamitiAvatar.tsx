import React, { useState } from 'react';

interface UncleRwamitiAvatarProps {
  className?: string;
  imgClassName?: string;
  showBackdrop?: boolean;
}

export const UncleRwamitiAvatar: React.FC<UncleRwamitiAvatarProps> = ({
  className = 'w-full h-full',
  imgClassName = 'w-full h-full object-cover object-top',
  showBackdrop = true,
}) => {
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showBackdrop && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#22170e] via-[#140f0c] to-[#08070a] pointer-events-none" />
      )}
      {!loadFailed ? (
        <img
          src="/uncle_rwamiti_man_only.png"
          alt="Uncle Rwamiti"
          className={`relative z-10 select-none ${imgClassName}`}
          referrerPolicy="no-referrer"
          onError={() => setLoadFailed(true)}
        />
      ) : (
        <img
          src="/rwamiti_official.svg"
          alt="Uncle Rwamiti"
          className={`relative z-10 select-none ${imgClassName}`}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};
