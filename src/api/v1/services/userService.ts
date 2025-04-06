import {
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../repositories/firestoreRepository";
import { User } from "../models/userModel";
import { ServiceError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const COLLECTION: string = "users";

/**
 * Create a new user.
 * @param {Partial<User>} userData - The data for the new user.
 * @returns {Promise<User>}
 */
export const createUser = async (userData: Partial<User>): Promise<User> => {
    try {
        const id = await createDocument(COLLECTION, userData);
        return { id, ...userData } as User;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to create user: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Retrieve user details by ID.
 * @param {string} id - The ID of the user.
 * @returns {Promise<User>}
 */
export const getUserById = async (id: string): Promise<User> => {
    try {
        const doc = await getDocumentById(COLLECTION, id);

        if (!doc.exists) {
            throw new Error(`User with ID ${id} not found.`);
        }

        return { id, ...doc.data() } as User;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to retrieve user ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Update user information.
 * @param {string} id - The ID of the user to update.
 * @param {Partial<User>} userData - The updated user data.
 * @returns {Promise<User>}
 */
export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    try {
        await updateDocument(COLLECTION, id, userData);
        return { id, ...userData } as User;
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to update user ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};

/**
 * Delete a user.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<void>}
 */
export const deleteUser = async (id: string): Promise<void> => {
    try {
        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw new ServiceError(
            `Failed to delete user ${id}: ${getErrorMessage(error)}`,
            getErrorCode(error)
        );
    }
};
