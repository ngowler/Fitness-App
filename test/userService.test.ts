import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../src/api/v1/services/userService";
import {
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
} from "../src/api/v1/repositories/firestoreRepository";
import { User } from "../src/api/v1/models/userModel";
import { ServiceError } from "../src/api/v1/errors/errors";

jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
    getDocumentById: jest.fn(),
}));

describe("User Service", () => {
    describe("createUser", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should create a new user", async (): Promise<void> => {
            const mockUserData: Partial<User> = { name: "John Doe", email: "john@example.com" };

            (createDocument as jest.Mock).mockResolvedValue("user123");

            const result: User = await createUser(mockUserData);

            expect(createDocument).toHaveBeenCalledWith("users", mockUserData);
            expect(result).toEqual({
                id: "user123",
                ...mockUserData,
            });
        });

        it("should throw an error if creation fails", async (): Promise<void> => {
            const mockUserData: Partial<User> = { name: "John Doe", email: "john@example.com" };
            const mockError: Error = new Error("Creation failed");

            (createDocument as jest.Mock).mockRejectedValue(mockError);

            await expect(createUser(mockUserData)).rejects.toThrow(
                new ServiceError("Failed to create user: Creation failed", "ERROR_CODE")
            );

            expect(createDocument).toHaveBeenCalledWith("users", mockUserData);
        });
    });

    describe("getUserById", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should retrieve a user by ID", async (): Promise<void> => {
            const mockDoc: { id: string; exists: boolean; data: () => Partial<User> } = {
                id: "user123",
                exists: true,
                data: (): Partial<User> => ({ name: "John Doe", email: "john@example.com" }),
            };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            const result: User = await getUserById("user123");

            expect(getDocumentById).toHaveBeenCalledWith("users", "user123");
            expect(result).toEqual({
                id: "user123",
                name: "John Doe",
                email: "john@example.com",
            });
        });

        it("should handle non-existent user", async (): Promise<void> => {
            const mockDoc: { id: string; exists: boolean } = { id: "user123", exists: false };

            (getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            await expect(getUserById("user123")).rejects.toThrow(
                new ServiceError("Failed to retrieve user user123: User with ID user123 not found.", "ERROR_CODE")
            );

            expect(getDocumentById).toHaveBeenCalledWith("users", "user123");
        });
    });

    describe("updateUser", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should update an existing user", async (): Promise<void> => {
            const id: string = "user123";
            const mockUserData: Partial<User> = { name: "Updated John Doe" };

            (updateDocument as jest.Mock).mockResolvedValue(undefined);

            const result: User = await updateUser(id, mockUserData);

            expect(updateDocument).toHaveBeenCalledWith("users", id, mockUserData);
            expect(result).toEqual({ id, ...mockUserData });
        });

        it("should handle update error", async (): Promise<void> => {
            const id: string = "user123";
            const mockUserData: Partial<User> = { name: "Updated John Doe" };
            const mockError: Error = new Error("Update failed");

            (updateDocument as jest.Mock).mockRejectedValue(mockError);

            await expect(updateUser(id, mockUserData)).rejects.toThrow(
                new ServiceError("Failed to update user user123: Update failed", "ERROR_CODE")
            );

            expect(updateDocument).toHaveBeenCalledWith("users", id, mockUserData);
        });
    });

    describe("deleteUser", () => {
        beforeEach((): void => {
            jest.clearAllMocks();
        });

        it("should delete a user by ID", async (): Promise<void> => {
            const id: string = "user123";

            (deleteDocument as jest.Mock).mockResolvedValue(undefined);

            await deleteUser(id);

            expect(deleteDocument).toHaveBeenCalledWith("users", id);
        });

        it("should handle delete error", async (): Promise<void> => {
            const id: string = "user123";
            const mockError: Error = new Error("Deletion failed");

            (deleteDocument as jest.Mock).mockRejectedValue(mockError);

            await expect(deleteUser(id)).rejects.toThrow(
                new ServiceError("Failed to delete user user123: Deletion failed", "ERROR_CODE")
            );

            expect(deleteDocument).toHaveBeenCalledWith("users", id);
        });
    });
});
