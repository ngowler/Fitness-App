/**
 * Configuration options for the isAuthorized middleware
 *
 * @interface AuthorizationOptions
 */
export interface AuthorizationOptions {
    /**
     * List of roles that are permitted to access the protected resource
     *
     * The middleware will grant access if the authenticated user has any of the
     * roles specified in this array.
     */
    hasRole: Array<"admin" | "user" | "premium" | "trainer">;

    /**
     * When set to true, allows users to access their own resources
     * regardless of their role
     *
     * This is typically used for routes that identify a specific user resource
     * by ID in the URL parameters. The middleware compares this ID with the
     * authenticated user's ID.
     *
     * @default false
     */
    allowSameUser?: boolean;
}