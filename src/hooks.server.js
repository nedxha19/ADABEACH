import { validateSession } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';

// protect every /admin path except the auth pages themselves
const ADMIN_PREFIX = '/admin';
const AUTH_PAGES = [`${ADMIN_PREFIX}/login`, `${ADMIN_PREFIX}/register`];

export async function handle({ event, resolve }) {
  const { cookies, url } = event;
  const sessionToken = cookies.get('session');

  // attach user to locals when session is valid
  if (sessionToken) {
    const user = await validateSession(sessionToken);
    if (user) {
      event.locals.user = user;
    } else {
      cookies.delete('session', { path: '/' });
    }
  }

  const isAdminArea = url.pathname.startsWith(ADMIN_PREFIX);
  const isAuthPage = AUTH_PAGES.includes(url.pathname);

  // block admin pages (anything under /admin) unless authenticated
  if (isAdminArea && !isAuthPage && !event.locals.user) {
    throw redirect(302, `${ADMIN_PREFIX}/login`);
  }

  // redirect logged-in users away from login/register
  if (isAuthPage && event.locals.user) {
    throw redirect(302, `${ADMIN_PREFIX}/gallery`);
  }

  return resolve(event);
}
