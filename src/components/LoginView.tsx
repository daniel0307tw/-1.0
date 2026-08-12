import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserData } from '../types';
import { Sparkles, ArrowRight, User, DollarSign, AlertCircle, Info, CheckCircle2, Smartphone } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Firestore } from 'firebase/firestore';
import { InstallGuideModal } from './InstallGuideModal';

interface LoginViewProps {
  db: Firestore;
  onLoginSuccess: (user: UserData) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ db, onLoginSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [hourlyRateInput, setHourlyRateInput] = useState<string>('190');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [notice, setNotice] = useState<{ type: 'info' | 'warn' | 'success'; msg: string } | null>(null);

  const handleCheckUsername = async (name: string) => {
    if (!name.trim()) {
      setNotice(null);
      return;
    }
    try {
      const docRef = doc(db, 'users', name.trim());
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const existingData = snap.data() as UserData;
        setNotice({
          type: 'info',
          msg: `💡 「${name.trim()}」已存在，登入將自動載入您的舊紀錄。`
        });
        if (existingData.hourlyRate) {
          setHourlyRateInput(existingData.hourlyRate.toString());
        }
      } else {
        setNotice({
          type: 'success',
          msg: `✨ 「${name.trim()}」為全新用戶，登入後將儲存此帳號。`
        });
      }
    } catch (err) {
      // ignore error
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = usernameInput.trim();
    if (!cleanName) {
      setNotice({ type: 'warn', msg: '請輸入您的用戶名稱喔！' });
      return;
    }

    const rateNum = parseFloat(hourlyRateInput);
    if (isNaN(rateNum) || rateNum < 0) {
      setNotice({ type: 'warn', msg: '請輸入有效的薪資金額！' });
      return;
    }

    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', cleanName);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const existingUser = snap.data() as UserData;
        onLoginSuccess(existingUser);
      } else {
        const newUser: UserData = {
          username: cleanName,
          hourlyRate: rateNum,
          isClockedIn: false,
          startTime: null,
          accumulatedMs: 0,
          history: []
        };
        await setDoc(userRef, newUser);
        onLoginSuccess(newUser);
      }
    } catch (err) {
      setNotice({ type: 'warn', msg: '連線資料庫失敗，請檢查網路。' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 overflow-hidden">
      {/* Top Banner Header */}
      <div className="text-center pt-2 space-y-3">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-[#FFD1DC] to-[#FFE8A3] shadow-md shadow-pink-100 border-2 border-white relative"
        >
          <span className="text-4xl select-none">🍯</span>
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm">
            <Sparkles size={14} className="text-[#FF8DA1]" />
          </div>
        </motion.div>
        <div>
          <h1 className="text-2xl font-black text-[#4A3B32]">給我錢1.0</h1>
          <p className="text-xs font-semibold text-[#8C7A6B] mt-1">
            薪資計算與即時打卡
          </p>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleLoginSubmit} className="space-y-4 my-auto">
        {/* Username Field */}
        <div className="p-4 rounded-3xl bg-white border-2 border-[#F3E5D8] shadow-sm space-y-2">
          <label className="block text-xs font-bold text-[#4A3B32] flex items-center gap-1.5">
            <User size={14} className="text-[#FF8DA1]" />
            <span>用戶名稱 (帳號)</span>
          </label>
          <input
            type="text"
            placeholder="請輸入您的名稱..."
            value={usernameInput}
            onChange={(e) => {
              setUsernameInput(e.target.value);
              handleCheckUsername(e.target.value);
            }}
            className="w-full px-4 py-3 rounded-2xl bg-[#FAF6EE] border-2 border-transparent focus:border-[#FF8DA1] focus:bg-white outline-none text-sm font-bold text-[#4A3B32] transition-all placeholder:text-[#B3A296]"
          />
        </div>

        {/* Salary Field */}
        <div className="p-4 rounded-3xl bg-white border-2 border-[#F3E5D8] shadow-sm space-y-2">
          <label className="block text-xs font-bold text-[#4A3B32] flex items-center gap-1.5">
            <DollarSign size={14} className="text-[#FF8DA1]" />
            <span>時薪金額 ($ / hr)</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-sm font-black text-[#8C7A6B]">$</span>
            <input
              type="number"
              min="0"
              placeholder="請輸入時薪，例如 190..."
              value={hourlyRateInput}
              onChange={(e) => setHourlyRateInput(e.target.value)}
              className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#FAF6EE] border-2 border-transparent focus:border-[#FF8DA1] focus:bg-white outline-none text-sm font-bold text-[#4A3B32] transition-all placeholder:text-[#B3A296]"
            />
          </div>
        </div>

        {/* Dynamic Notification */}
        {notice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              notice.type === 'info'
                ? 'bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]'
                : notice.type === 'success'
                ? 'bg-[#D4F0DF] text-[#15803D] border border-[#BBF7D0]'
                : 'bg-[#FFE2E6] text-[#E11D48] border border-[#FECDD3]'
            }`}
          >
            {notice.type === 'info' && <Info size={15} className="shrink-0" />}
            {notice.type === 'success' && <CheckCircle2 size={15} className="shrink-0" />}
            {notice.type === 'warn' && <AlertCircle size={15} className="shrink-0" />}
            <span>{notice.msg}</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 bg-gradient-to-r from-[#FF8DA1] to-[#FFB7C5] text-white rounded-3xl font-black text-base shadow-lg shadow-pink-200 border-2 border-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>開始打卡</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </motion.button>
      </form>

      {/* Footer Branding & Install PWA Button */}
      <div className="text-center pb-1 flex flex-col items-center gap-1.5">
        <button
          onClick={() => setShowInstallModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF8DA1] bg-white px-3 py-1.5 rounded-full border border-[#FFD1DC] shadow-sm hover:bg-[#FFE2E6] active:scale-95 transition-all"
        >
          <Smartphone size={14} />
          <span>加到手機主螢幕 (安裝為 App)</span>
        </button>
        <p className="text-[10px] font-black text-[#8C7A6B]/50 tracking-widest uppercase">
          MoMo Work Timer • 雲端即時保存
        </p>
      </div>

      <InstallGuideModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
};
