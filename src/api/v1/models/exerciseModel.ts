export type Exercise = {
    id?: string;
    workoutId: string;
    name: string;
    equipment: string[];
    musclesWorked: string[];
    intensity: "Low" | "Medium" | "High";
    sets?: number; // enter this in updateExercise
    reps?: number; // enter this in updateExercise
};
