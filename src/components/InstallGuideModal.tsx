import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Share2, PlusSquare, Download, X, CheckCircle2 } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone app mode
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="bg-[#FFFBF2] w-full max-w-sm rounded-[32px] p-5 shadow-2xl border-4 border-[#FFD1DC] text-[#4A3B32] relative overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-[#F3E5D8] flex items-center justify-center text-[#8C7A6B] hover:bg-[#FFE2E6]"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center pt-2 pb-3">
            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-[#FFD1DC] flex items-center justify-center text-2xl shadow-sm">
              📲
            </div>
            <h3 className="text-lg font-black text-[#4A3B32]">安裝至手機 / 桌面</h3>
            <p className="text-xs text-[#8C7A6B] mt-1 font-medium">
              固定在手機主螢幕，開啟即用無網址列！
            </p>
          </div>

          {isStandalone ? (
            <div className="bg-[#D4F0DF] text-[#15803D] p-4 rounded-2xl flex items-center gap-3 my-2 text-xs font-bold border border-[#BBF7D0]">
              <CheckCircle2 size={20} className="shrink-0" />
              <span>已成功安裝為 App 獨立運行中！</span>
            </div>
          ) : (
            <div className="space-y-3.5 my-2 max-h-[60vh] overflow-y-auto pr-1">
              {/* One-click install button if available (Android/Chrome) */}
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 bg-[#FF8DA1] text-white font-black text-sm rounded-2xl shadow-lg shadow-pink-200 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 transition-all"
                >
                  <Download size={18} />
                  一鍵安裝「給我錢1.0」APP
                </button>
              )}

              {/* iPhone / iPad (Safari) Instructions */}
              <div className="p-3.5 bg-white rounded-2xl border-2 border-[#F3E5D8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[#FF8DA1]">
                  <Smartphone size={15} />
                  <span>iPhone / iPad (Safari 瀏覽器)</span>
                </div>
                <ol className="text-xs text-[#6E5A4C] space-y-2 pl-1 list-none font-medium">
                  <li className="flex items-start gap-2">
                    <span className="bg-[#FFE2E6] text-[#FF8DA1] font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                    <span>點擊 Safari 下方工具列的「<Share2 size={13} className="inline mx-0.5 text-[#FF8DA1]" /> <b>分享</b>」按鈕</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-[#FFE2E6] text-[#FF8DA1] font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                    <span>往下滑動選擇「<PlusSquare size={13} className="inline mx-0.5 text-[#FF8DA1]" /> <b>加入主螢幕</b>」</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-[#FFE2E6] text-[#FF8DA1] font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                    <span>點擊右上角「<b>新增</b>」即可產生獨立 APP 圖示！</span>
                  </li>
                </ol>
              </div>

              {/* Android Instructions */}
              <div className="p-3.5 bg-white rounded-2xl border-2 border-[#F3E5D8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-[#4A3B32]">
                  <Smartphone size={15} />
                  <span>Android (Chrome 瀏覽器)</span>
                </div>
                <ol className="text-xs text-[#6E5A4C] space-y-2 pl-1 list-none font-medium">
                  <li className="flex items-start gap-2">
                    <span className="bg-[#F3E5D8] text-[#4A3B32] font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                    <span>點擊 Chrome 右上角「<b>⋮ 三個點選單</b>」</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-[#F3E5D8] text-[#4A3B32] font-bold rounded-full w-4 h-4 flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                    <span>選擇「<b>新增至主螢幕</b>」或「<b>安裝應用程式</b>」</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Bottom Confirm */}
          <button
            onClick={onClose}
            className="w-full mt-3 py-2.5 bg-[#4A3B32] text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
          >
            我知道了
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
