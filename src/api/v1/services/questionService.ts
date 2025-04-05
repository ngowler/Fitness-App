import {
    getDocuments,
    createDocument,
    updateDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { Question } from "../models/questionModel";
import { ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const COLLECTION: string = "questions";

/**
 * Create a new question for a trainer.
 * @param {Partial<Question>} questionData - The data for the new question.
 * @returns {Promise<Question>}
 */
export const createQuestion = async (questionData: Partial<Question>): Promise<Question> => {
    try {
        const dateAsked = new Date().toISOString();
        const completeQuestionData = { ...questionData, dateAsked };

        const id = await createDocument(COLLECTION, completeQuestionData);
        return { id, ...completeQuestionData } as Question;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to create question: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};


/**
 * Retrieve all questions.
 * @returns {Promise<Question[]>}
 */
export const getAllQuestions = async (): Promise<Question[]> => {
    try {
        const snapshot = await getDocuments(COLLECTION);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Question[];
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve questions: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Retrieve all questions by a specific user.
 * @param {string} userId - The ID of the user who asked the questions.
 * @returns {Promise<Question[]>}
 */
export const getAllQuestionsByUserId = async (userId: string): Promise<Question[]> => {
    try {
        const snapshot = await getDocuments(COLLECTION);
        const questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Question[];
        return questions.filter((question) => question.userId === userId);
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve questions for user ${userId}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Retrieve a specific question by ID.
 * @param {string} id - The ID of the question.
 * @returns {Promise<Question>}
 */
export const getQuestionById = async (id: string): Promise<Question> => {
    try {
        const doc = await getDocumentById(COLLECTION, id);

        if (!doc.exists) {
            throw new Error(`Question with ID ${id} not found.`);
        }

        return { id, ...doc.data() } as Question;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve question ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Respond to a specific question.
 * @param {string} id - The ID of the question to respond to.
 * @param {Partial<Question>} responseData - The response to the question.
 * @returns {Promise<Question>}
 */
export const respondToQuestion = async (
    id: string,
    responseData: Partial<Question>
): Promise<Question> => {
    try {
        const dateResponded = new Date().toISOString();
        const updatedData = { ...responseData, dateResponded };

        await updateDocument(COLLECTION, id, updatedData);

        return { id, ...updatedData } as Question;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to respond to question ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

