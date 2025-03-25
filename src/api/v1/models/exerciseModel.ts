export type Exercise = {
    id?: string;
    workoutId: string;
    name: string;
    equipment: string[];
    musclesWorked: string[];
    intensity: "Low" | "Medium" | "High";
    duration?: number;
    reps?: number;
};
