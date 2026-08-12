export interface ShiftLog {
  id: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  hourlyRate: number;
  earned: number;
}

export interface UserData {
  username: string;
  hourlyRate: number;
  isClockedIn: boolean;
  isPaused?: boolean;
  startTime: number | null; // ms timestamp
  accumulatedMs: number;
  avatarId?: string;
  jobTitle?: string;
  history?: ShiftLog[];
}

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  border: string;
  tag: string;
}

export interface SalaryPreset {
  id: string;
  title: string;
  rate: number;
  emoji: string;
  color: string;
}

export const KOREAN_PASTEL = {
  bgCanvas: '#FAF6EE',
  cardWhite: '#FFFFFF',
  textPrimary: '#4A3B32',
  textSecondary: '#8C7A6B',
  textMuted: '#B3A296',
  pinkSoft: '#FFD1DC',
  pinkAccent: '#FF8DA1',
  creamAccent: '#FFF1D6',
  yellowSoft: '#FFE8A3',
  mintSoft: '#D4F0DF',
  blueSoft: '#D0E8FF',
  purpleSoft: '#E6D7FF',
  borderLight: '#F3E5D8'
};
