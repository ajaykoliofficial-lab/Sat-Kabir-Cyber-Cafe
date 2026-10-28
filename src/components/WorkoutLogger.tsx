import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Plus,
  Trash2,
  Check,
  Timer,
  Save,
  Dumbbell,
  Layers,
  ChevronDown,
  ChevronUp,
  History,
  Clock,
  Sparkles,
} from 'lucide-react';
import { LoggedExercise, MuscleGroup, WorkoutSession, ExerciseSet } from '../types';
import { EXERCISE_LIBRARY, WORKOUT_TEMPLATES, getTodayDateString } from '../utils/storage';
import { soundManager, triggerHaptic } from '../utils/audio';

interface WorkoutLoggerProps {
  workouts: WorkoutSession[];
  onSaveWorkout: (workout: WorkoutSession) => void;
  onOpenRestTimer: (seconds: number) => void;
}

export const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({
  workouts,
  onSaveWorkout,
  onOpenRestTimer,
}) => {
  const [activeTab, setActiveTab] = useState<'logger' | 'history'>('logger');
  const [workoutTitle, setWorkoutTitle] = useState('Push Day Hypertrophy');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [exercises, setExercises] = useState<LoggedExercise[]>([
    {
      id: 'ex_init_1',
      name: 'Barbell Bench Press',
      muscleGroup: 'Chest',
      sets: [
        { id: 's1', setNumber: 1, weightKg: 60, reps: 10, completed: true },
        { id: 's2', setNumber: 2, weightKg: 70, reps: 8, completed: true },
        { id: 's3', setNumber: 3, weightKg: 75, reps: 6, completed: false },
      ],
    },
    {
      id: 'ex_init_2',
      name: 'Incline Dumbbell Press',
      muscleGroup: 'Chest',
      sets: [
        { id: 's4', setNumber: 1, weightKg: 24, reps: 10, completed: true },
        { id: 's5', setNumber: 2, weightKg: 26, reps: 8, completed: false },
      ],
    },
  ]);

  const [notes, setNotes] = useState('');
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  // Exercise picker modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [customExerciseName, setCustomExerciseName] = useState('');

  // Calculate live volume
  const liveTotalVolume = exercises.reduce((acc, ex) => {
    const exVolume = ex.sets.reduce((sAcc, s) => {
      return s.completed ? sAcc + (s.weightKg * s.reps) : sAcc;
    }, 0);
    return acc + exVolume;
  }, 0);

  // Handle loading a template
  const handleLoadTemplate = (templateId: string) => {
    soundManager.playClick();
    const template = WORKOUT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    setWorkoutTitle(template.title);

    const newExercises: LoggedExercise[] = template.exercises.map((name, idx) => {
      const match = EXERCISE_LIBRARY.find((e) => e.name === name);
      const muscle = match?.muscleGroup || 'Chest';
      const weight = match?.defaultWeight || 50;
      const reps = match?.defaultReps || 10;

      return {
        id: `tpl_${Date.now()}_${idx}`,
        name,
        muscleGroup: muscle,
        sets: [
          { id: `s_${idx}_1`, setNumber: 1, weightKg: weight, reps, completed: false },
          { id: `s_${idx}_2`, setNumber: 2, weightKg: weight, reps, completed: false },
          { id: `s_${idx}_3`, setNumber: 3, weightKg: weight, reps, completed: false },
        ],
      };
    });

    setExercises(newExercises);
  };

  // Add exercise from library or custom
  const handleAddExercise = (name: string, muscle: MuscleGroup, defaultWeight = 50, defaultReps = 10) => {
    soundManager.playClick();
    const newEx: LoggedExercise = {
      id: `ex_${Date.now()}`,
      name,
      muscleGroup: muscle,
      sets: [
        { id: `s_${Date.now()}_1`, setNumber: 1, weightKg: defaultWeight, reps: defaultReps, completed: false },
        { id: `s_${Date.now()}_2`, setNumber: 2, weightKg: defaultWeight, reps: defaultReps, completed: false },
        { id: `s_${Date.now()}_3`, setNumber: 3, weightKg: defaultWeight, reps: defaultReps, completed: false },
      ],
    };
    setExercises([...exercises, newEx]);
    setShowAddModal(false);
    setCustomExerciseName('');
  };

  // Remove exercise
  const handleRemoveExercise = (id: string) => {
    soundManager.playClick();
    setExercises(exercises.filter((e) => e.id !== id));
  };

  // Add set to exercise
  const handleAddSet = (exerciseId: string) => {
    soundManager.playClick();
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: ExerciseSet = {
          id: `s_${Date.now()}_${ex.sets.length + 1}`,
          setNumber: ex.sets.length + 1,
          weightKg: lastSet ? lastSet.weightKg : 50,
          reps: lastSet ? lastSet.reps : 10,
          completed: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    );
  };

  // Delete set
  const handleDeleteSet = (exerciseId: string, setId: string) => {
    soundManager.playClick();
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const filtered = ex.sets.filter((s) => s.id !== setId);
        // Renumber sets
        const renumbered = filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
        return { ...ex, sets: renumbered };
      })
    );
  };

  // Update set value
  const handleUpdateSet = (exerciseId: string, setId: string, field: 'weightKg' | 'reps', value: number) => {
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
        };
      })
    );
  };

  // Toggle set completed
  const handleToggleSetComplete = (exerciseId: string, setId: string) => {
    triggerHaptic('light');
    soundManager.playClick();
    setExercises(
      exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id === setId) {
              const nextState = !s.completed;
              // If completing, prompt rest timer suggestion
              return { ...s, completed: nextState };
            }
            return s;
          }),
        };
      })
    );
  };

  // Save workout
  const handleSave = () => {
    if (exercises.length === 0) return;

    soundManager.playCheckin();
    triggerHaptic('success');

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a3e635', '#22c55e', '#38bdf8', '#fb923c'],
      });
    } catch {
      // Confetti fallback
    }

    const session: WorkoutSession = {
      id: `ws_${Date.now()}`,
      date: getTodayDateString(),
      title: workoutTitle.trim() || 'Gym Workout',
      durationMinutes,
      exercises,
      totalVolumeKg: liveTotalVolume,
      notes: notes.trim(),
      intensityRating: 5,
    };

    onSaveWorkout(session);
    setActiveTab('history');
  };

  // Filtered exercise library list
  const filteredLibrary = EXERCISE_LIBRARY.filter((item) => {
    if (selectedMuscle === 'All') return true;
    return item.muscleGroup === selectedMuscle;
  });

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Tab Switcher: Logger vs History */}
      <div className="flex items-center gap-2 p-1 bg-[#12161f] border border-[#1f2633] rounded-xl">
        <button
          onClick={() => setActiveTab('logger')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'logger'
              ? 'bg-lime-400 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Active Workout</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-lime-400 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Workout History ({workouts.length})</span>
        </button>
      </div>

      {activeTab === 'logger' ? (
        <div className="space-y-4">
          {/* Workout Header Info */}
          <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Workout Session Title
                </label>
                <input
                  type="text"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-lime-400"
                  placeholder="e.g. Push Day Hypertrophy"
                />
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-24 bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-white font-bold text-sm font-data focus:outline-none focus:border-lime-400 text-center"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Live Volume
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-[#161b24] border border-[#242c3b] text-lime-400 font-bold text-sm font-data text-center min-w-[90px]">
                    {liveTotalVolume.toLocaleString()} kg
                  </div>
                </div>
              </div>
            </div>

            {/* Template Quick Selectors */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-lime-400" />
                <span>Load Preset Template</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {WORKOUT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleLoadTemplate(tpl.id)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#181e2a] hover:bg-[#202838] text-slate-300 hover:text-white border border-[#222b3b] transition-colors"
                  >
                    {tpl.title.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Rest Timer Trigger Bar */}
          <div className="bg-[#12161f] border border-[#1f2633] rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <Timer className="w-4 h-4 text-lime-400" />
              <span>Rest Between Sets:</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenRestTimer(60)}
                className="px-2.5 py-1 rounded-lg bg-[#181f2b] hover:bg-[#222a3a] text-xs font-medium text-slate-200 border border-[#222b3b]"
              >
                60s
              </button>
              <button
                onClick={() => onOpenRestTimer(90)}
                className="px-2.5 py-1 rounded-lg bg-[#181f2b] hover:bg-[#222a3a] text-xs font-medium text-slate-200 border border-[#222b3b]"
              >
                90s
              </button>
              <button
                onClick={() => onOpenRestTimer(120)}
                className="px-2.5 py-1 rounded-lg bg-[#181f2b] hover:bg-[#222a3a] text-xs font-medium text-slate-200 border border-[#222b3b]"
              >
                120s
              </button>
            </div>
          </div>

          {/* Exercise Sets Cards */}
          <div className="space-y-3">
            {exercises.map((ex, exIndex) => {
              return (
                <div
                  key={ex.id}
                  className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-lime-950/80 border border-lime-500/30 text-lime-400 text-xs font-bold flex items-center justify-center font-data">
                        {exIndex + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                          {ex.muscleGroup}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sets Table */}
                  <div className="space-y-1.5">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                      <span className="col-span-2 text-center">Set</span>
                      <span className="col-span-4 text-center">Weight (kg)</span>
                      <span className="col-span-4 text-center">Reps</span>
                      <span className="col-span-2 text-center">Done</span>
                    </div>

                    {/* Sets Rows */}
                    {ex.sets.map((set) => (
                      <div
                        key={set.id}
                        className={`grid grid-cols-12 gap-2 items-center p-1.5 rounded-xl transition-all border ${
                          set.completed
                            ? 'bg-lime-950/20 border-lime-500/30'
                            : 'bg-[#161b24] border-[#222a38]'
                        }`}
                      >
                        <span className="col-span-2 text-center text-xs font-bold font-data text-slate-400">
                          {set.setNumber}
                        </span>

                        <div className="col-span-4 flex items-center justify-center">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={set.weightKg}
                            onChange={(e) =>
                              handleUpdateSet(ex.id, set.id, 'weightKg', Number(e.target.value))
                            }
                            className="w-full bg-[#1b222f] border border-[#273244] rounded-lg py-1 px-2 text-center text-white text-xs font-bold font-data focus:outline-none focus:border-lime-400"
                          />
                        </div>

                        <div className="col-span-4 flex items-center justify-center">
                          <input
                            type="number"
                            min="1"
                            value={set.reps}
                            onChange={(e) =>
                              handleUpdateSet(ex.id, set.id, 'reps', Number(e.target.value))
                            }
                            className="w-full bg-[#1b222f] border border-[#273244] rounded-lg py-1 px-2 text-center text-white text-xs font-bold font-data focus:outline-none focus:border-lime-400"
                          />
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <button
                            onClick={() => handleToggleSetComplete(ex.id, set.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              set.completed
                                ? 'bg-lime-400 text-black shadow-[0_0_8px_#a3e635]'
                                : 'bg-[#222b3b] text-slate-400 hover:text-white'
                            }`}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add set button */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1b222f]">
                    <button
                      onClick={() => handleAddSet(ex.id)}
                      className="text-xs font-semibold text-lime-400 hover:text-lime-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Set</span>
                    </button>
                    <button
                      onClick={() => onOpenRestTimer(90)}
                      className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <Timer className="w-3.5 h-3.5" />
                      <span>Rest Timer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Exercise CTA button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#242d3c] hover:border-lime-400/60 bg-[#12161f]/50 hover:bg-[#12161f] text-slate-300 hover:text-lime-400 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exercise to Session</span>
          </button>

          {/* Optional notes */}
          <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Workout Notes / PRs
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Increased bench press by 2.5kg, felt great pump in chest."
              className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-lime-400 resize-none"
            />
          </div>

          {/* Save & Finish Workout Bar */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-lime-500 via-emerald-400 to-lime-400 text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(163,230,53,0.3)] hover:shadow-[0_12px_40px_rgba(163,230,53,0.45)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Finish &amp; Save Workout ({liveTotalVolume.toLocaleString()} kg)</span>
            </button>
          </div>
        </div>
      ) : (
        /* WORKOUT HISTORY LIST */
        <div className="space-y-3">
          {workouts.length === 0 ? (
            <div className="text-center py-12 bg-[#12161f] rounded-2xl border border-[#1f2633] p-6">
              <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No workouts recorded yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Switch back to the logger to complete and save your first session!
              </p>
            </div>
          ) : (
            workouts.map((w) => {
              const isExpanded = expandedHistoryId === w.id;
              return (
                <div
                  key={w.id}
                  className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 transition-all"
                >
                  <div
                    onClick={() => setExpandedHistoryId(isExpanded ? null : w.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{w.title}</span>
                        <span className="text-[10px] bg-lime-950/70 text-lime-400 border border-lime-500/30 px-1.5 py-0.5 rounded font-data">
                          {w.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{w.durationMinutes} mins</span>
                        </span>
                        <span>·</span>
                        <span className="text-lime-400 font-data font-bold">
                          {w.totalVolumeKg?.toLocaleString()} kg volume
                        </span>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg bg-[#181f2b] text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded exercise details */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#1c222e] space-y-3">
                      {w.notes && (
                        <p className="text-xs italic text-slate-400 bg-[#161b24] p-2 rounded-lg">
                          &ldquo;{w.notes}&rdquo;
                        </p>
                      )}
                      <div className="space-y-2">
                        {w.exercises?.map((ex) => (
                          <div key={ex.id} className="bg-[#161b24] p-3 rounded-xl border border-[#222a38]">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-slate-200">{ex.name}</span>
                              <span className="text-[10px] text-slate-400">{ex.muscleGroup}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {ex.sets.map((s) => (
                                <span
                                  key={s.id}
                                  className="text-[11px] font-data bg-[#1b222f] px-2 py-0.5 rounded text-slate-300 border border-[#263142]"
                                >
                                  {s.weightKg}kg × {s.reps}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ADD EXERCISE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#12161f] border border-[#242c3b] rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c222e]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-lime-400" />
                <span>Select Exercise</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Muscle Group Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar shrink-0">
              {(['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMuscle(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedMuscle === m
                      ? 'bg-lime-400 text-black'
                      : 'bg-[#181f2b] text-slate-300 hover:bg-[#20293a]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Library list */}
            <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-1">
              {filteredLibrary.map((item) => (
                <button
                  key={item.name}
                  onClick={() =>
                    handleAddExercise(item.name, item.muscleGroup, item.defaultWeight, item.defaultReps)
                  }
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#161b24] hover:bg-[#1e2533] border border-[#222a38] text-left transition-colors group"
                >
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-lime-400 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.muscleGroup} · Default: {item.defaultWeight}kg × {item.defaultReps}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-lime-400" />
                </button>
              ))}
            </div>

            {/* Custom Exercise Input */}
            <div className="pt-3 border-t border-[#1c222e] mt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Or Create Custom Exercise
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customExerciseName}
                  onChange={(e) => setCustomExerciseName(e.target.value)}
                  placeholder="e.g. Bulgarian Split Squats"
                  className="flex-1 bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                />
                <button
                  onClick={() => {
                    if (customExerciseName.trim()) {
                      handleAddExercise(
                        customExerciseName.trim(),
                        selectedMuscle === 'All' ? 'Chest' : selectedMuscle,
                        40,
                        10
                      );
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-lime-400 text-black text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
