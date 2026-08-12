import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7EFEE] flex items-center justify-center p-0 sm:p-6 font-sans text-[#4A3B32] selection:bg-[#FFD1DC]">
      {/* Outer Phone Shell */}
      <div className="w-full max-w-[430px] h-[100dvh] sm:h-[880px] bg-[#FAF6EE] sm:rounded-[52px] sm:shadow-[0_25px_60px_-15px_rgba(255,183,197,0.4)] sm:border-[10px] sm:border-white relative overflow-hidden flex flex-col">
        {/* Content View */}
        <div className="flex-1 overflow-hidden relative flex flex-col h-full">
          {children}
        </div>

        {/* Phone Bottom Indicator */}
        <div className="w-full py-2 flex justify-center shrink-0 bg-transparent pointer-events-none">
          <div className="w-32 h-1 bg-[#4A3B32]/15 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
