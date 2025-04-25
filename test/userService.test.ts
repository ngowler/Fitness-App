import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
} from "../src/api/v1/services/userService";
import { User } from "../src/api/v1/models/userModel";
import { ServiceError } from "../src/api/v1/errors/errors";
import { auth, db } from "../config/firebaseConfig";

jest.mock("../config/firebaseConfig", () => ({
    auth: {
        createUser: jest.fn(),
        setCustomUserClaims: jest.fn(),
    },
    db: {
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                set: jest.fn(),
                get: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            })),
        })),
    },
}));

describe("User Service", () => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create a new Firebase user and Firestore document", async (): Promise<void> => {
            const mockUserData: Partial<User> = {
                name: "John Doe",
                email: "john@example.com",
                password: "Secure123!",
            };
            const mockFirebaseUser = { uid: "firebase123" };
    
            (auth.createUser as jest.Mock).mockResolvedValue(mockFirebaseUser);
    
            const mockDocSet = jest.fn();
            (db.collection as jest.Mock).mockReturnValue({
                doc: jest.fn(() => ({
                    set: mockDocSet,
                })),
            });
    
            const result: User = await createUser(mockUserData);
        
            expect(auth.createUser).toHaveBeenCalledWith({
                email: mockUserData.email,
                password: "Secure123!",
            });
    
            expect(result).toEqual({
                id: "firebase123",
                name: mockUserData.name,
                email: mockUserData.email,
            });
        });
    
        it("should throw an error if Firebase user creation fails", async (): Promise<void> => {
            const mockUserData: Partial<User> = {
                name: "John Doe",
                email: "john@example.com",
                password: "Secure123!",
            };
            const mockError: Error = new Error("Firebase creation failed");
    
            (auth.createUser as jest.Mock).mockRejectedValue(mockError);
    
            await expect(createUser(mockUserData)).rejects.toThrow(
                new ServiceError("Failed to create user: Firebase creation failed", "FIREBASE_ERROR")
            );
    
            expect(auth.createUser).toHaveBeenCalledWith({
                email: mockUserData.email,
                password: "Secure123!",
            });
        });
    });
    

    describe("getUserById", () => {
        it("should retrieve a user from Firestore by ID", async (): Promise<void> => {
            const mockUserData = { name: "John Doe", email: "john@example.com" };
            const mockDocGet = jest.fn().mockResolvedValue({
                exists: true,
                data: jest.fn(() => mockUserData),
            });

            (db.collection as jest.Mock).mockReturnValue({
                doc: jest.fn(() => ({
                    get: mockDocGet,
                })),
            });

            const result: User = await getUserById("firebase123");

            expect(db.collection).toHaveBeenCalledWith("users");
            expect(mockDocGet).toHaveBeenCalled();
            expect(result).toEqual({
                id: "firebase123",
                ...mockUserData,
            });
        });

        it("should throw an error if the user does not exist", async (): Promise<void> => {
            const mockDocGet = jest.fn().mockResolvedValue({ exists: false });

            (db.collection as jest.Mock).mockReturnValue({
                doc: jest.fn(() => ({
                    get: mockDocGet,
                })),
            });

            await expect(getUserById("firebase123")).rejects.toThrow(
                new ServiceError(
                    "Failed to retrieve user firebase123: Document not found in collection users with id firebase123",
                    "NOT_FOUND"
                )
            );

            expect(db.collection).toHaveBeenCalledWith("users");
            expect(mockDocGet).toHaveBeenCalled();
        });
    });

    describe("updateUser", () => {
        it("should update an existing user's Firestore document", async (): Promise<void> => {
            const mockUserData: Partial<User> = { name: "Updated John Doe" };
            const mockDocUpdate = jest.fn();

            (db.collection as jest.Mock).mockReturnValue({
                doc: jest.fn(() => ({
                    update: mockDocUpdate,
                })),
            });

            const result: User = await updateUser("firebase123", mockUserData);

            expect(db.collection).toHaveBeenCalledWith("users");
            expect(mockDocUpdate).toHaveBeenCalledWith(mockUserData);
            expect(result).toEqual({ id: "firebase123", ...mockUserData });
        });

        it("should throw an error if the update fails", async (): Promise<void> => {
            const mockUserData: Partial<User> = { name: "Updated John Doe" };
            const mockError: Error = new Error("Update failed");

            (db.collection as jest.Mock).mockReturnValue({
                doc: jest.fn(() => ({
                    update: jest.fn().mockRejectedValue(mockError),
                })),
            });

            await expect(updateUser("firebase123", mockUserData)).rejects.toThrow(
                new ServiceError(
                    "Failed to update user firebase123: Failed to update document firebase123 in users: Update failed",
                    "UPDATE_ERROR"
                )
            );

            expect(db.collection).toHaveBeenCalledWith("users");
        });
    });

    describe("deleteUser", () => {
        it("should delete a user by ID", async (): Promise<void> => {
            const mockDocDelete = jest.fn();

            (db.collection as jest.Mock).mockReturnValue({
                doc: jest.fn(() => ({
                    delete: mockDocDelete,
                })),
            });

            await deleteUser("firebase123");

            expect(db.collection).toHaveBeenCalledWith("users");
            expect(mockDocDelete).toHaveBeenCalled();
        });

        it("should throw an error if deletion fails", async (): Promise<void> => {
            const id: string = "firebase123";
            const mockError: Error = new Error("Deletion failed");

            (db.collection as jest.Mock).mockReturnValue({
                doc: jest.fn(() => ({
                    delete: jest.fn().mockRejectedValue(mockError),
                })),
            });

            await expect(deleteUser(id)).rejects.toThrow(
                new ServiceError(
                    `Failed to delete user ${id}: Failed to delete document ${id} from users: Deletion failed`,
                    "DELETE_ERROR"
                )
            );

            expect(db.collection).toHaveBeenCalledWith("users");
        });
    });
});
