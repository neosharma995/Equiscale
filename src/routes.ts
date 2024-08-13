/** routes accessible to public (authentication not required)
 * @type {string[]}
 **/
export const publicRoutes = [
    '/',
    '/auth/new-verification',
    '/company-details',
    '/markets',
]

/** routes accessible to users that are authenticated
 * @type {string[]}
 **/
export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/reset',
    '/auth/new-password',
]

/** routes that start with the prefix are used for API authentication purpose
 * @type {string}
 **/

export const apiAuthPrefix = '/api/auth'

/** routes accessible to admin users only
 * @type {string}
 **/

export const adminRoutes = ['/admin']

/** default login path
 * @type {string}
 **/
export const DEFAULT_LOGIN_REDIRECT = '/settings'
