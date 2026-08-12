import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserData, ShiftLog } from '../types';
import { LineArtBear } from './LineArtBear';
import { ShiftHistoryModal } from './ShiftHistoryModal';
import { InstallGuideModal } from './InstallGuideModal';
import {
  Clock,
  DollarSign,
  Play,
  Pause,
  Square,
  LogOut,
  Calendar,
  Edit2,
  TrendingUp,
  RefreshCw,
  Check,
  X,
  Coffee,
  Smartphone
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';

interface MainWorkViewProps {
  db: Firestore;
  user: UserData;
  onLogout: () => void;
}

export const MainWorkView: React.FC<MainWorkViewProps> = ({ db, user, onLogout }) => {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [newSalaryInput, setNewSalaryInput] = useState(user.hourlyRate.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time timer calculation
  useEffect(() => {
    if (user.isClockedIn && !user.isPaused && user.startTime) {
      const updateTimer = () => {
        const elapsed = Date.now() - user.startTime!;
        setCurrentTimeMs((user.accumulatedMs || 0) + elapsed);
      };
      updateTimer();
      timerRef.current = setInterval(updateTimer, 100);
    } else if (user.isClockedIn && user.isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCurrentTimeMs(user.accumulatedMs || 0);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      // When not clocked in, timer resets to 0
      setCurrentTimeMs(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user.isClockedIn, user.isPaused, user.startTime, user.accumulatedMs]);

  // Handle Start Clock In (開始打卡)
  const handleStartClock = async () => {
    if (user.hourlyRate <= 0) {
      alert('請先設定有效時薪後再開始打卡喔！');
      return;
    }

    setIsUpdating(true);
    const userRef = doc(db, 'users', user.username);

    try {
      await updateDoc(userRef, {
        isClockedIn: true,
        isPaused: false,
        startTime: Date.now(),
        accumulatedMs: 0
      });
    } catch (err) {
      alert('打卡失敗，請檢查網路。');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Pause (暫停 / 休息)
  const handlePauseClock = async () => {
    setIsUpdating(true);
    const userRef = doc(db, 'users', user.username);
    const now = Date.now();
    const elapsed = user.startTime ? now - user.startTime : 0;
    const newAccumulated = (user.accumulatedMs || 0) + elapsed;

    try {
      await updateDoc(userRef, {
        isPaused: true,
        startTime: null,
        accumulatedMs: newAccumulated
      });
    } catch (err) {
      alert('暫停失敗，請檢查網路。');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Resume (繼續 / 恢復上班)
  const handleResumeClock = async () => {
    setIsUpdating(true);
    const userRef = doc(db, 'users', user.username);

    try {
      await updateDoc(userRef, {
        isPaused: false,
        startTime: Date.now()
      });
    } catch (err) {
      alert('恢復打卡失敗，請檢查網路。');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle End Shift / Clock Out (結束打卡 / 下班)
  const handleClockOut = async () => {
    setIsUpdating(true);
    const userRef = doc(db, 'users', user.username);

    try {
      const now = Date.now();
      let totalMs = user.accumulatedMs || 0;
      if (!user.isPaused && user.startTime) {
        totalMs += now - user.startTime;
      }

      const shiftEarned = (totalMs / 3600000) * user.hourlyRate;

      const newLog: ShiftLog = {
        id: `shift_${now}`,
        startTime: user.startTime || now - totalMs,
        endTime: now,
        durationMs: totalMs,
        hourlyRate: user.hourlyRate,
        earned: shiftEarned
      };

      const updatedHistory = [...(user.history || []), newLog];

      // Reset timer to zero on clock out
      await updateDoc(userRef, {
        isClockedIn: false,
        isPaused: false,
        startTime: null,
        accumulatedMs: 0,
        history: updatedHistory
      });
    } catch (err) {
      alert('下班打卡更新失敗，請檢查網路。');
    } finally {
      setIsUpdating(false);
    }
  };

  // Save updated salary
  const handleSaveSalary = async () => {
    const rate = parseFloat(newSalaryInput);
    if (isNaN(rate) || rate < 0) {
      alert('請輸入正確的薪資數字');
      return;
    }

    const userRef = doc(db, 'users', user.username);
    try {
      await updateDoc(userRef, { hourlyRate: rate });
      setIsEditingSalary(false);
    } catch (err) {
      alert('更新薪資失敗');
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('確定要清除所有打卡紀錄嗎？')) {
      const userRef = doc(db, 'users', user.username);
      await updateDoc(userRef, { history: [] });
    }
  };

  // Time formatter
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const { hours, minutes, seconds } = formatTime(currentTimeMs);
  const currentEarnings = ((currentTimeMs / 3600000) * user.hourlyRate).toFixed(2);

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 overflow-hidden relative">
      {/* Top Header Navigation Bar */}
      <div className="flex items-center justify-between pt-1 pb-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-[#FFD1DC] border-2 border-white flex items-center justify-center text-xl shadow-sm">
            🍯
          </div>
          <div>
            <h2 className="text-base font-black text-[#4A3B32]">{user.username}</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#8C7A6B]">
              <span>時薪 ${user.hourlyRate}/hr</span>
              <button
                onClick={() => {
                  setNewSalaryInput(user.hourlyRate.toString());
                  setIsEditingSalary(!isEditingSalary);
                }}
                className="text-[#FF8DA1] p-0.5 hover:bg-[#FFE2E6] rounded-md transition-colors"
                title="修改薪資"
              >
                <Edit2 size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInstallModal(true)}
            className="w-10 h-10 rounded-2xl bg-white border border-[#FFD1DC] text-[#FF8DA1] flex items-center justify-center shadow-sm hover:bg-[#FFE2E6] active:scale-95 transition-all"
            title="安裝至手機主螢幕"
          >
            <Smartphone size={18} />
          </button>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="w-10 h-10 rounded-2xl bg-white border border-[#F3E5D8] flex items-center justify-center text-[#8C7A6B] shadow-sm hover:bg-[#FFF0F3] active:scale-95 transition-all"
            title="班表紀錄"
          >
            <Calendar size={18} />
          </button>
          <button
            onClick={onLogout}
            className="w-10 h-10 rounded-2xl bg-white border border-[#F3E5D8] flex items-center justify-center text-[#8C7A6B] shadow-sm hover:bg-[#FFE2E6] active:scale-95 transition-all"
            title="切換帳號"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Salary Edit Drawer/Popover */}
      <AnimatePresence>
        {isEditingSalary && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-white rounded-2xl border-2 border-[#FFD1DC] shadow-md flex items-center gap-2 my-1 shrink-0"
          >
            <span className="text-xs font-bold text-[#4A3B32]">修改時薪:</span>
            <div className="flex-1 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7A6B]">$</span>
              <input
                type="number"
                min="0"
                value={newSalaryInput}
                onChange={(e) => setNewSalaryInput(e.target.value)}
                className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-[#FAF6EE] text-xs font-bold text-[#4A3B32] outline-none border border-[#F3E5D8] focus:border-[#FF8DA1]"
                placeholder="輸入時薪..."
              />
            </div>
            <button
              onClick={handleSaveSalary}
              className="p-2 bg-[#FF8DA1] text-white rounded-xl hover:opacity-90 active:scale-95"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setIsEditingSalary(false)}
              className="p-2 bg-[#EFE0D5] text-[#8C7A6B] rounded-xl hover:opacity-90"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Clock Card - Centered and Clean */}
      <motion.div
        layout
        className="w-full bg-white rounded-[32px] p-5 shadow-xl shadow-pink-100/60 border-4 border-[#FFD1DC]/30 flex flex-col items-center text-center my-auto space-y-4 shrink-0"
      >
        {/* Working Status Badge */}
        <div
          className={`px-3.5 py-1 rounded-full text-[11px] font-black tracking-wider flex items-center gap-1.5 ${
            user.isClockedIn
              ? user.isPaused
                ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                : 'bg-[#D4F0DF] text-[#15803D] border border-[#BBF7D0]'
              : 'bg-[#F3E5D8] text-[#8C7A6B] border border-[#E5D3C3]'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              user.isClockedIn
                ? user.isPaused
                  ? 'bg-[#F59E0B]'
                  : 'bg-[#22C55E] animate-ping'
                : 'bg-[#A89A8D]'
            }`}
          />
          <span>
            {user.isClockedIn
              ? user.isPaused
                ? '休息暫停中 PAUSED'
                : '打卡上班中 WORKING'
              : '待機下班中 OFF-DUTY'}
          </span>
        </div>

        {/* Cute Line Art Bear Animation */}
        <div className="py-2">
          <LineArtBear isWorking={user.isClockedIn} isPaused={!!user.isPaused} />
        </div>

        {/* Digital Clock Display */}
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-widest">
            {user.isClockedIn ? '本日班別工時' : '待機中 (下班已歸零)'}
          </div>
          <div className="text-4xl font-black text-[#4A3B32] font-mono tracking-tight flex items-baseline justify-center gap-1">
            <span>{hours}</span>
            <span className={`text-[#FF8DA1] ${user.isClockedIn && !user.isPaused ? 'animate-pulse' : ''}`}>:</span>
            <span>{minutes}</span>
            <span className={`text-[#FF8DA1] ${user.isClockedIn && !user.isPaused ? 'animate-pulse' : ''}`}>:</span>
            <span className="text-2xl text-[#8C7A6B]">{seconds}</span>
          </div>
        </div>

        {/* Live Wage Earnings Banner */}
        <div className="w-full p-3.5 rounded-2xl bg-gradient-to-tr from-[#FFF0F3] to-[#FFF8E7] border-2 border-[#FFD1DC] flex items-center justify-between">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={12} className="text-[#FF8DA1]" /> 本次預估薪資
            </span>
            <div className="text-2xl font-black text-[#FF8DA1] font-mono tracking-tight flex items-baseline">
              <span className="text-xs mr-1">$</span>
              <span>{currentEarnings}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-[#8C7A6B] block">計算時薪</span>
            <span className="text-xs font-black text-[#4A3B32]">${user.hourlyRate} / hr</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Control Buttons Section */}
      <div className="space-y-2.5 pt-2 pb-1 shrink-0">
        {!user.isClockedIn ? (
          /* Off-duty: Single Clock In Button */
          <motion.button
            type="button"
            disabled={isUpdating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartClock}
            className="w-full py-4 rounded-3xl font-black text-lg shadow-xl border-4 border-white bg-gradient-to-r from-[#B9E2F5] to-[#D0E8FF] text-[#335C67] shadow-blue-100 flex items-center justify-center gap-2.5 transition-all"
          >
            {isUpdating ? (
              <RefreshCw size={22} className="animate-spin text-[#335C67]" />
            ) : (
              <>
                <Play size={22} fill="currentColor" />
                <span>開始打卡 (上班)</span>
              </>
            )}
          </motion.button>
        ) : (
          /* Clocked In: Pause/Resume + Clock Out Buttons */
          <div className="flex items-center gap-2.5">
            {/* Pause / Resume Button */}
            {user.isPaused ? (
              <motion.button
                type="button"
                disabled={isUpdating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResumeClock}
                className="flex-1 py-4 rounded-3xl font-black text-base shadow-lg border-4 border-white bg-gradient-to-r from-[#86EFAC] to-[#BBF7D0] text-[#166534] shadow-green-100 flex items-center justify-center gap-2 transition-all"
              >
                {isUpdating ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <>
                    <Play size={20} fill="currentColor" />
                    <span>繼續上班</span>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                disabled={isUpdating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePauseClock}
                className="flex-1 py-4 rounded-3xl font-black text-base shadow-lg border-4 border-white bg-gradient-to-r from-[#FDE68A] to-[#FEF3C7] text-[#92400E] shadow-amber-100 flex items-center justify-center gap-2 transition-all"
              >
                {isUpdating ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <>
                    <Coffee size={20} />
                    <span>休息暫停</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Clock Out (下班) Button */}
            <motion.button
              type="button"
              disabled={isUpdating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClockOut}
              className="flex-1 py-4 rounded-3xl font-black text-base shadow-lg border-4 border-white bg-gradient-to-r from-[#FF8DA1] to-[#FFB7C5] text-white shadow-pink-200 flex items-center justify-center gap-2 transition-all"
            >
              {isUpdating ? (
                <RefreshCw size={20} className="animate-spin text-white" />
              ) : (
                <>
                  <Square size={20} fill="currentColor" />
                  <span>結束 (下班)</span>
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* History Modal Trigger */}
        <button
          onClick={() => setShowHistoryModal(true)}
          className="w-full py-2.5 px-4 rounded-2xl bg-white border border-[#F3E5D8] flex items-center justify-between text-xs text-[#8C7A6B] font-bold shadow-sm hover:bg-[#FFFBF2] transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#FF8DA1]" />
            <span>歷史打卡班表 ({user.history?.length || 0} 筆)</span>
          </span>
          <span className="text-[#FF8DA1] font-extrabold">查看 ›</span>
        </button>
      </div>

      {/* Shift History Modal */}
      <ShiftHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        logs={user.history || []}
        onClearLogs={handleClearHistory}
      />

      {/* Install App Guide Modal */}
      <InstallGuideModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
