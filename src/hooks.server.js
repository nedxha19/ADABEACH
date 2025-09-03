import { validateSession } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';

// List of admin routes that require authentication
const ADMIN_ROUTES = ['/admin', '/admin/gallery', '/admin/gallery/new'];

export async function handle({ event, resolve }) {
    const { cookies, url } = event;
    const sessionToken = cookies.get('session');
    
    // Validate session if token exists
    if (sessionToken) {
        const user = await validateSession(sessionToken);
        if (user) {
            event.locals.user = user;
        } else {
            // Clear invalid session
            cookies.delete('session', { path: '/' });
        }
    }
    
    // Check if accessing admin route without authentication
    const isAdminRoute = ADMIN_ROUTES.some(route => url.pathname.startsWith(route));
    if (isAdminRoute && !event.locals.user) {
        throw redirect(302, '/login');
    }
    
    // Redirect authenticated users away from login/register pages
    const isAuthPage = ['/login', '/register'].includes(url.pathname);
    if (isAuthPage && event.locals.user) {
        throw redirect(302, '/admin/gallery');
    }
    
    return resolve(event);
}