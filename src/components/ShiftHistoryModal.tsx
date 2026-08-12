import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShiftLog } from '../types';
import { X, Calendar, Clock, DollarSign, Trash2, Award } from 'lucide-react';

interface ShiftHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ShiftLog[];
  onClearLogs?: () => void;
}

export const ShiftHistoryModal: React.FC<ShiftHistoryModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs
}) => {
  if (!isOpen) return null;

  const totalEarned = logs.reduce((sum, log) => sum + log.earned, 0);
  const totalHours = (logs.reduce((sum, log) => sum + log.durationMs, 0) / 3600000).toFixed(1);

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDuration = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) return `${hrs}小時 ${mins}分`;
    if (mins > 0) return `${mins}分 ${secs}秒`;
    return `${secs}秒`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#4A3B32]/40 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-[400px] bg-[#FAF6EE] rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl border-t-4 sm:border-4 border-white max-h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F3E5D8]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFD1DC] flex items-center justify-center text-white">
                <Calendar size={18} />
              </div>
              <div>
                <h3 className="font-black text-base text-[#4A3B32]">打卡班表紀錄 📜</h3>
                <p className="text-[10px] text-[#8C7A6B]">紀錄每次班次與累積總額</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8C7A6B] shadow-sm hover:bg-[#FFE2E6] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Overall Stats Banner */}
          <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#FFF0F3] to-[#FFF8E7] border border-[#FFD1DC] flex items-center justify-around">
            <div className="text-center">
              <div className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider flex items-center justify-center gap-1">
                <Clock size={12} className="text-[#FF8DA1]" />
                總累積工時
              </div>
              <div className="text-lg font-black text-[#4A3B32] mt-0.5">{totalHours} hr</div>
            </div>
            <div className="w-px h-8 bg-[#FFD1DC]"></div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider flex items-center justify-center gap-1">
                <Award size={12} className="text-[#FF8DA1]" />
                總打卡工資
              </div>
              <div className="text-lg font-black text-[#FF8DA1] mt-0.5">${totalEarned.toFixed(0)}</div>
            </div>
          </div>

          {/* Log List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-2">
            {logs.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#8C7A6B] space-y-2">
                <span className="text-3xl block">🧺</span>
                <p>目前尚無歷史打卡紀錄喔！</p>
              </div>
            ) : (
              logs.slice().reverse().map((log, index) => (
                <div
                  key={log.id || index}
                  className="p-3.5 rounded-2xl bg-white border border-[#F3E5D8] shadow-sm flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#4A3B32] flex items-center gap-1.5">
                      <span>{formatDate(log.startTime)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF1D6] text-[#8C7A6B] font-medium">
                        時薪 ${log.hourlyRate}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8C7A6B] flex items-center gap-1">
                      <Clock size={11} />
                      <span>長度: {formatDuration(log.durationMs)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#FF8DA1] flex items-center justify-end">
                      <DollarSign size={13} />
                      <span>{log.earned.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {logs.length > 0 && onClearLogs && (
            <div className="pt-3 border-t border-[#F3E5D8] flex justify-end">
              <button
                onClick={onClearLogs}
                className="text-xs text-[#8C7A6B] hover:text-red-400 flex items-center gap-1 font-bold py-1 px-2"
              >
                <Trash2 size={12} />
                <span>清除打卡紀錄</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
