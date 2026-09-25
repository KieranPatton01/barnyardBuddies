import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  fedCount: number;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  fedCount,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 w-full z-40 pt-safe bg-[#FAF8F2]/90 backdrop-blur-xl border-b border-[#351000]/5 shadow-[0_2px_12px_rgba(53,16,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Logo and App Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A34A] to-[#4ADE80] flex items-center justify-center text-white shadow-sm flex-shrink-0 text-xl">
            🐾
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-base font-extrabold text-[#351000] tracking-tight leading-tight truncate">
              Barnyard Buddies (BB)
            </h1>
            <span className="text-[11px] font-bold text-[#006b2c] flex items-center gap-1 truncate">
              {activeTab === 'hungry' 
                ? (pendingCount > 0 ? `${pendingCount} in Wishlist ✨` : 'Wishlist Ready ✨') 
                : `${fedCount} Full Tummies 🤤`}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
