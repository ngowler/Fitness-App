import { Exercise } from "./exerciseModel";

export type Workout = {
    id?: string;
    userId: string;
    name: string;
    description?: string;
    date: string;
    exercises: Exercise[];
};
