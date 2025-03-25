export type ExerciseLibrary = {
    id?: string;
    name: string;
    equipment: string[];
    musclesWorked: string[];
    intensity: "Low" | "Medium" | "High";
};
