import { Badge, DailyCheckIn, UserProfile, WeightRecord, WorkoutSession, LoggedExercise } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'fitstreak_user_profile',
  CHECKINS: 'fitstreak_daily_checkins',
  WORKOUTS: 'fitstreak_workout_history',
  BADGES: 'fitstreak_badges',
  WEIGHTS: 'fitstreak_weight_history',
};

// Formats a Date object to YYYY-MM-DD in local time
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatDate(new Date());
}

// Preset exercise library for fast logging
export const EXERCISE_LIBRARY: { name: string; muscleGroup: LoggedExercise['muscleGroup']; defaultReps: number; defaultWeight: number }[] = [
  { name: 'Barbell Bench Press', muscleGroup: 'Chest', defaultReps: 8, defaultWeight: 70 },
  { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', defaultReps: 10, defaultWeight: 24 },
  { name: 'Cable Chest Flyes', muscleGroup: 'Chest', defaultReps: 12, defaultWeight: 15 },
  { name: 'Barbell Deadlift', muscleGroup: 'Back', defaultReps: 5, defaultWeight: 110 },
  { name: 'Lat Pulldown', muscleGroup: 'Back', defaultReps: 10, defaultWeight: 55 },
  { name: 'Seated Cable Row', muscleGroup: 'Back', defaultReps: 10, defaultWeight: 60 },
  { name: 'Barbell Back Squat', muscleGroup: 'Legs', defaultReps: 6, defaultWeight: 90 },
  { name: 'Leg Press', muscleGroup: 'Legs', defaultReps: 10, defaultWeight: 160 },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs', defaultReps: 10, defaultWeight: 70 },
  { name: 'Standing Calf Raises', muscleGroup: 'Legs', defaultReps: 15, defaultWeight: 50 },
  { name: 'Overhead Barbell Press', muscleGroup: 'Shoulders', defaultReps: 8, defaultWeight: 45 },
  { name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders', defaultReps: 12, defaultWeight: 10 },
  { name: 'Face Pulls', muscleGroup: 'Shoulders', defaultReps: 15, defaultWeight: 25 },
  { name: 'Barbell Bicep Curl', muscleGroup: 'Arms', defaultReps: 10, defaultWeight: 30 },
  { name: 'Tricep Rope Pushdown', muscleGroup: 'Arms', defaultReps: 12, defaultWeight: 22 },
  { name: 'Hammer Curls', muscleGroup: 'Arms', defaultReps: 12, defaultWeight: 14 },
  { name: 'Hanging Leg Raises', muscleGroup: 'Core', defaultReps: 12, defaultWeight: 0 },
  { name: 'Plank Hold (seconds)', muscleGroup: 'Core', defaultReps: 60, defaultWeight: 0 },
  { name: 'Treadmill Incline Run', muscleGroup: 'Cardio', defaultReps: 20, defaultWeight: 0 },
];

export const WORKOUT_TEMPLATES = [
  {
    id: 'push',
    title: 'Push Day (Chest, Shoulders, Triceps)',
    exercises: ['Barbell Bench Press', 'Overhead Barbell Press', 'Incline Dumbbell Press', 'Dumbbell Lateral Raise', 'Tricep Rope Pushdown'],
  },
  {
    id: 'pull',
    title: 'Pull Day (Back & Biceps)',
    exercises: ['Barbell Deadlift', 'Lat Pulldown', 'Seated Cable Row', 'Face Pulls', 'Barbell Bicep Curl'],
  },
  {
    id: 'legs',
    title: 'Legs & Core Destroyer',
    exercises: ['Barbell Back Squat', 'Leg Press', 'Romanian Deadlift', 'Standing Calf Raises', 'Hanging Leg Raises'],
  },
  {
    id: 'full_body',
    title: 'Full Body Functional',
    exercises: ['Barbell Back Squat', 'Barbell Bench Press', 'Lat Pulldown', 'Overhead Barbell Press', 'Plank Hold (seconds)'],
  },
];

// Initial default badges
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'streak_3',
    title: '3-Day Momentum',
    description: 'Crush 3 workout days in a row',
    icon: '🔥',
    category: 'streak',
    isUnlocked: true,
    unlockedAt: '2026-10-25',
    progress: 100,
    targetRequirement: '3 consecutive days',
  },
  {
    id: 'streak_7',
    title: '7-Day Iron Discipline',
    description: 'Maintain a 7-day continuous streak',
    icon: '⚡',
    category: 'streak',
    isUnlocked: false,
    progress: 71, // 5 / 7 days
    targetRequirement: '7 consecutive days',
  },
  {
    id: 'streak_30',
    title: '30-Day Beast Mode',
    description: 'Cement a lifelong fitness habit with 30 consecutive days',
    icon: '🏆',
    category: 'streak',
    isUnlocked: false,
    progress: 17,
    targetRequirement: '30 consecutive days',
  },
  {
    id: 'weight_100',
    title: 'Century Lifter',
    description: 'Lift 100 kg or more in a single set (Squat, Bench, or Deadlift)',
    icon: '🏋️',
    category: 'milestone',
    isUnlocked: true,
    unlockedAt: '2026-10-26',
    progress: 100,
    targetRequirement: 'Single set >= 100kg',
  },
  {
    id: 'volume_10k',
    title: '10-Ton Club',
    description: 'Move over 10,000 kg total cumulative workout volume',
    icon: '💥',
    category: 'volume',
    isUnlocked: true,
    unlockedAt: '2026-10-27',
    progress: 100,
    targetRequirement: 'Total volume >= 10,000kg',
  },
  {
    id: 'early_bird',
    title: 'Dawn Warrior',
    description: 'Check in or log a workout before 8:00 AM',
    icon: '🌅',
    category: 'consistency',
    isUnlocked: true,
    unlockedAt: '2026-10-24',
    progress: 100,
    targetRequirement: 'Workout completed before 08:00',
  },
  {
    id: 'five_workouts',
    title: 'Habit Architect',
    description: 'Log 5 fully detailed workout sessions',
    icon: '🎯',
    category: 'consistency',
    isUnlocked: true,
    unlockedAt: '2026-10-27',
    progress: 100,
    targetRequirement: '5 sessions logged',
  },
  {
    id: 'volume_50k',
    title: 'Titan Volume',
    description: 'Lift 50,000 kg total volume across all sessions',
    icon: '👑',
    category: 'volume',
    isUnlocked: false,
    progress: 42,
    targetRequirement: 'Total volume >= 50,000kg',
  },
];

export const INITIAL_PROFILE: UserProfile = {
  id: 'usr_001',
  name: 'Alex Sterling',
  email: 'alex@fitstreak.app',
  avatarSeed: 'fitness_warrior',
  goal: 'muscle_gain',
  targetWeight: 75.0,
  currentWeight: 72.8,
  preferredGymTime: '18:30', // 6:30 PM
  targetDaysPerWeek: 5,
  reminderMinutesBefore: 30,
  notificationsEnabled: true,
  soundEnabled: true,
  language: 'en',
  createdAt: '2026-09-01',
};

// Generates realistic past check-ins (e.g. 5-day active streak ending today or yesterday)
export function getInitialCheckins(): DailyCheckIn[] {
  const checkins: DailyCheckIn[] = [];
  const today = new Date();

  // Create check-ins for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);

    // Give a 5-day active streak from i=4 to i=0 (or i=5 to i=1)
    // Days 5, 4, 3, 2, 1 days ago are completed
    let isCompleted = false;
    let workoutTitle: string | undefined = undefined;

    if (i === 0) {
      // Today: defaults to false so user has the instant satisfaction of clicking it!
      isCompleted = false;
    } else if (i <= 5) {
      isCompleted = true;
      workoutTitle = ['Push Power', 'Pull Hypertrophy', 'Legs & Core', 'Upper Body', 'Conditioning'][i % 5];
    } else if (i === 6) {
      isCompleted = false; // Rest day broke earlier run
    } else if (i >= 8 && i <= 12) {
      isCompleted = true;
      workoutTitle = 'Strength Circuit';
    } else if (i % 3 !== 0) {
      isCompleted = true;
      workoutTitle = 'Gym Session';
    }

    checkins.push({
      date: dateStr,
      completed: isCompleted,
      timestamp: isCompleted ? `${dateStr}T18:45:00` : undefined,
      workoutTitle,
      durationMinutes: isCompleted ? 50 + (i % 20) : undefined,
      mood: 'energized',
    });
  }

  return checkins;
}

// Initial realistic weight entries
export function getInitialWeights(): WeightRecord[] {
  const weights: WeightRecord[] = [];
  const today = new Date();
  const startWeight = 71.2;

  for (let i = 28; i >= 0; i -= 4) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const progress = (28 - i) / 28;
    const current = +(startWeight + progress * 1.6 + (Math.sin(i) * 0.2)).toFixed(1);

    weights.push({
      id: `w_${i}`,
      date: formatDate(d),
      weightKg: current,
      note: i === 28 ? 'Starting check-in' : i === 0 ? 'Latest morning check' : undefined,
    });
  }

  return weights;
}

// Initial realistic workout sessions
export function getInitialWorkouts(): WorkoutSession[] {
  const today = new Date();
  const getPastDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return formatDate(d);
  };

  return [
    {
      id: 'ws_1',
      date: getPastDate(1),
      title: 'Push Day Hypertrophy',
      durationMinutes: 55,
      totalVolumeKg: 4620,
      notes: 'Pushed for progressive overload on bench press! Felt strong.',
      intensityRating: 4,
      exercises: [
        {
          id: 'ex_1',
          name: 'Barbell Bench Press',
          muscleGroup: 'Chest',
          sets: [
            { id: 's1', setNumber: 1, weightKg: 60, reps: 10, completed: true },
            { id: 's2', setNumber: 2, weightKg: 70, reps: 8, completed: true },
            { id: 's3', setNumber: 3, weightKg: 75, reps: 6, completed: true },
            { id: 's4', setNumber: 4, weightKg: 80, reps: 5, completed: true },
          ],
        },
        {
          id: 'ex_2',
          name: 'Overhead Barbell Press',
          muscleGroup: 'Shoulders',
          sets: [
            { id: 's5', setNumber: 1, weightKg: 40, reps: 10, completed: true },
            { id: 's6', setNumber: 2, weightKg: 45, reps: 8, completed: true },
            { id: 's7', setNumber: 3, weightKg: 45, reps: 8, completed: true },
          ],
        },
        {
          id: 'ex_3',
          name: 'Tricep Rope Pushdown',
          muscleGroup: 'Arms',
          sets: [
            { id: 's8', setNumber: 1, weightKg: 20, reps: 12, completed: true },
            { id: 's9', setNumber: 2, weightKg: 25, reps: 10, completed: true },
            { id: 's10', setNumber: 3, weightKg: 25, reps: 10, completed: true },
          ],
        },
      ],
    },
    {
      id: 'ws_2',
      date: getPastDate(2),
      title: 'Pull Power & Back',
      durationMinutes: 60,
      totalVolumeKg: 5850,
      notes: 'Hit 110kg deadlift clean reps!',
      intensityRating: 5,
      exercises: [
        {
          id: 'ex_4',
          name: 'Barbell Deadlift',
          muscleGroup: 'Back',
          sets: [
            { id: 's11', setNumber: 1, weightKg: 90, reps: 6, completed: true },
            { id: 's12', setNumber: 2, weightKg: 100, reps: 5, completed: true },
            { id: 's13', setNumber: 3, weightKg: 110, reps: 4, completed: true },
          ],
        },
        {
          id: 'ex_5',
          name: 'Lat Pulldown',
          muscleGroup: 'Back',
          sets: [
            { id: 's14', setNumber: 1, weightKg: 50, reps: 12, completed: true },
            { id: 's15', setNumber: 2, weightKg: 55, reps: 10, completed: true },
            { id: 's16', setNumber: 3, weightKg: 60, reps: 8, completed: true },
          ],
        },
        {
          id: 'ex_6',
          name: 'Barbell Bicep Curl',
          muscleGroup: 'Arms',
          sets: [
            { id: 's17', setNumber: 1, weightKg: 25, reps: 12, completed: true },
            { id: 's18', setNumber: 2, weightKg: 30, reps: 10, completed: true },
          ],
        },
      ],
    },
    {
      id: 'ws_3',
      date: getPastDate(3),
      title: 'Legs & Core Crusher',
      durationMinutes: 50,
      totalVolumeKg: 6400,
      intensityRating: 5,
      exercises: [
        {
          id: 'ex_7',
          name: 'Barbell Back Squat',
          muscleGroup: 'Legs',
          sets: [
            { id: 's19', setNumber: 1, weightKg: 80, reps: 8, completed: true },
            { id: 's20', setNumber: 2, weightKg: 90, reps: 8, completed: true },
            { id: 's21', setNumber: 3, weightKg: 95, reps: 6, completed: true },
          ],
        },
      ],
    },
  ];
}

// Storage helpers
export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading profile from storage', e);
  }
  return INITIAL_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function loadCheckins(): DailyCheckIn[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading checkins', e);
  }
  const initial = getInitialCheckins();
  saveCheckins(initial);
  return initial;
}

export function saveCheckins(checkins: DailyCheckIn[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
  } catch (e) {
    console.error('Error saving checkins', e);
  }
}

export function loadWorkouts(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading workouts', e);
  }
  const initial = getInitialWorkouts();
  saveWorkouts(initial);
  return initial;
}

export function saveWorkouts(workouts: WorkoutSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  } catch (e) {
    console.error('Error saving workouts', e);
  }
}

export function loadBadges(): Badge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading badges', e);
  }
  return INITIAL_BADGES;
}

export function saveBadges(badges: Badge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {
    console.error('Error saving badges', e);
  }
}

export function loadWeights(): WeightRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading weights', e);
  }
  const initial = getInitialWeights();
  saveWeights(initial);
  return initial;
}

export function saveWeights(weights: WeightRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(weights));
  } catch (e) {
    console.error('Error saving weights', e);
  }
}

// Calculate streaks: current streak and longest streak
export function calculateStreak(checkins: DailyCheckIn[]): { currentStreak: number; longestStreak: number; isDoneToday: boolean } {
  const todayStr = getTodayDateString();
  const checkinMap = new Map<string, boolean>();
  checkins.forEach((c) => {
    checkinMap.set(c.date, c.completed);
  });

  const isDoneToday = Boolean(checkinMap.get(todayStr));

  // Determine starting point for current streak
  let currentStreak = 0;
  const cursor = new Date();

  // If not completed today yet, check if yesterday was completed
  if (!isDoneToday) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const dateKey = formatDate(cursor);
    if (checkinMap.get(dateKey)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak across history
  // Sort dates
  const sortedDates = Array.from(checkinMap.keys()).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const completed = checkinMap.get(dateStr);
    const currentDate = new Date(dateStr + 'T00:00:00');

    if (completed) {
      if (prevDate) {
        const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = currentDate;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
      prevDate = null;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    isDoneToday,
  };
}

// Check and update badges
export function updateBadgesEvaluation(
  currentStreak: number,
  workouts: WorkoutSession[],
  currentBadges: Badge[]
): { updatedBadges: Badge[]; newlyUnlocked: Badge[] } {
  const newlyUnlocked: Badge[] = [];

  // Calculate totals
  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const totalWorkouts = workouts.length;
  let maxWeightLifted = 0;

  workouts.forEach((w) => {
    w.exercises?.forEach((ex) => {
      ex.sets?.forEach((s) => {
        if (s.completed && s.weightKg > maxWeightLifted) {
          maxWeightLifted = s.weightKg;
        }
      });
    });
  });

  const updatedBadges = currentBadges.map((badge) => {
    if (badge.isUnlocked) return badge;

    let progress = 0;
    let shouldUnlock = false;

    switch (badge.id) {
      case 'streak_3':
        progress = Math.min(100, Math.round((currentStreak / 3) * 100));
        shouldUnlock = currentStreak >= 3;
        break;
      case 'streak_7':
        progress = Math.min(100, Math.round((currentStreak / 7) * 100));
        shouldUnlock = currentStreak >= 7;
        break;
      case 'streak_30':
        progress = Math.min(100, Math.round((currentStreak / 30) * 100));
        shouldUnlock = currentStreak >= 30;
        break;
      case 'weight_100':
        progress = Math.min(100, Math.round((maxWeightLifted / 100) * 100));
        shouldUnlock = maxWeightLifted >= 100;
        break;
      case 'volume_10k':
        progress = Math.min(100, Math.round((totalVolume / 10000) * 100));
        shouldUnlock = totalVolume >= 10000;
        break;
      case 'volume_50k':
        progress = Math.min(100, Math.round((totalVolume / 50000) * 100));
        shouldUnlock = totalVolume >= 50000;
        break;
      case 'five_workouts':
        progress = Math.min(100, Math.round((totalWorkouts / 5) * 100));
        shouldUnlock = totalWorkouts >= 5;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      const unlockedBadge = {
        ...badge,
        isUnlocked: true,
        progress: 100,
        unlockedAt: getTodayDateString(),
      };
      newlyUnlocked.push(unlockedBadge);
      return unlockedBadge;
    }

    return { ...badge, progress };
  });

  return { updatedBadges, newlyUnlocked };
}
