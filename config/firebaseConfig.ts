/**
 * Firebase Admin SDK initialization module
 *
 * This module handles the initialization of Firebase Admin SDK for server-side
 * operations. It sets up authentication and Firestore database connections.
 */

import {
    initializeApp,
    cert,
    getApps,
    App,
    AppOptions,
    ServiceAccount,
} from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { EnvironmentConfigurationError } from "../src/api/v1/errors/errors"

/**
 * Retrieves Firebase configuration from environment variables
 *
 * @returns {AppOptions} Firebase application configuration object
 * @throws {EnvironmentConfigurationError} If any required environment variables are missing
 */
function getFirebaseConfig(): AppOptions {
    const {
        FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY,
    } = process.env;

    if (
        !FIREBASE_PROJECT_ID ||
        !FIREBASE_CLIENT_EMAIL ||
        !FIREBASE_PRIVATE_KEY
    ) {
        throw new EnvironmentConfigurationError(
            "Missing Firebase configuration. Please check your environment variables.",
            "FIREBASE_CONFIG_ERROR",
            400
        );
    }

    const serviceAccount: ServiceAccount = {
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };

    return {
        credential: cert(serviceAccount),
    };
}

/**
 * Initializes Firebase Admin SDK if not already initialized
 *
 * This function implements the singleton pattern to ensure only
 * one Firebase app instance is created.
 *
 * @returns {App} Firebase Admin app instance
 */
function initializeFirebaseAdmin(): App {
    const existingApp: App = getApps()[0];
    if (existingApp) {
        return existingApp;
    }
    return initializeApp(getFirebaseConfig());
}

const app: App = initializeFirebaseAdmin();

const db: Firestore = getFirestore(app);

const auth: Auth = getAuth(app);

export { db, auth };