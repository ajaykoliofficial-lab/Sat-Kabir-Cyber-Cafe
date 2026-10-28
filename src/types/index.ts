export type FitnessGoal = 'muscle_gain' | 'weight_loss' | 'strength' | 'endurance' | 'general_fitness';

export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarSeed: string;
  goal: FitnessGoal;
  targetWeight: number; // in kg
  currentWeight: number; // in kg
  preferredGymTime: string; // e.g. "18:30"
  targetDaysPerWeek: number; // e.g. 5
  reminderMinutesBefore: number; // e.g. 30
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  language: 'en' | 'hi';
  createdAt: string;
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface LoggedExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  title: string;
  durationMinutes: number;
  exercises: LoggedExercise[];
  totalVolumeKg: number;
  notes?: string;
  intensityRating?: number; // 1 to 5
}

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD
  completed: boolean;
  timestamp?: string;
  workoutTitle?: string;
  durationMinutes?: number;
  mood?: 'energized' | 'tired' | 'beast' | 'normal';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'volume' | 'consistency' | 'milestone';
  unlockedAt?: string;
  isUnlocked: boolean;
  progress: number; // 0 to 100
  targetRequirement: string;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
}

export type ActiveTab = 'dashboard' | 'logger' | 'analytics' | 'badges' | 'profile';
