import React from 'react';
import { ActiveTab } from '../types';

interface SegmentedTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCount: number;
  fedCount: number;
}

export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  fedCount,
}) => {
  return (
    <div className="grid grid-cols-2 p-1 bg-[#ffeae1] rounded-full shadow-inner border border-[#351000]/5 max-w-md mx-auto">
      <button
        type="button"
        onClick={() => onTabChange('hungry')}
        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
          activeTab === 'hungry'
            ? 'bg-[#00873a] text-white shadow-[0_4px_12px_rgba(0,107,44,0.25)]'
            : 'text-[#3e4a3d] hover:text-[#351000]'
        }`}
      >
        <span className="text-base">✨</span>
        <span>Wishlist ({pendingCount})</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('barnyard')}
        className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
          activeTab === 'barnyard'
            ? 'bg-[#00873a] text-white shadow-[0_4px_12px_rgba(0,107,44,0.25)]'
            : 'text-[#3e4a3d] hover:text-[#351000]'
        }`}
      >
        <span className="text-base">🤤</span>
        <span>Full Tummies ({fedCount})</span>
      </button>
    </div>
  );
};
