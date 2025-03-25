export type Question = {
    id?: string;
    userId: string;
    trainerId?: string;
    question: string;
    response?: string;
    dateAsked: string;
    dateResponded?: string;
};
