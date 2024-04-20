/**
 * An Array of router thats are accessible to the pubplic 
 * This route do not require authentication 
 * @type {string[]}
*/

export const publicRoutes = [
    "/",
    "/auth/new-verification",
    '/api/s3-upload',
    "/api/s3-array-upload",
    '/profile/'
]
/**
 * An Array of router thats are used for authentication
 * These routes will redirect logged in users to /settings 
 * @type {string[]}
*/
export const authRoutes = [ 
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpouses
 * @type {string[]}
*/
export const apiAuthPrefix = "/api/auth";
/**
 * The default redirect path after logging in
 * @type {string[]}
*/

/**
 * An Array of router thats are accessible only to ADMIN 
 * This route is require authentication 
 * @type {string[]}
*/

export const adminRoutes = [
    "/admin",
    "/server",
]
export const DEFAULT_LOGIN_REDIRECT = "/settings/profile";