export type User = {
    id?: string;
    name: string;
    email: string;
    role: "Lite" | "Premium" | "Trainer" | "Admin";
    healthMetrics: {
        weight: number;
        height: number;
        bodyFatPercentage?: number;
        injuriesOrLimitations?: string[];
    };
    workoutPreferences: {
        daysAvailable: string[];
        timePerDay: number;
        gymAccess: boolean;
        equipment?: string[];
    };
    background: {
        experience: string;
        routine: string;
        goals: string;
    };
};
