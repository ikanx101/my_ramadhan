
export type PrayerStatus = 'jamaah' | 'sendiri' | 'missed' | 'none';

export interface DailyPrayerTracker {
  subuh: PrayerStatus;
  dzuhur: PrayerStatus;
  ashar: PrayerStatus;
  maghrib: PrayerStatus;
  isya: PrayerStatus;
  tarawih: PrayerStatus;
}

export interface QuranProgress {
  surahIndex: number;
  ayah: number;
}

export interface DailyEntry {
  date: string; // ISO format
  prayers: DailyPrayerTracker;
  quran: QuranProgress;
  infaq: number;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
}

export interface ImsakiyahTime {
  day: number;
  imsak: string;
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}
