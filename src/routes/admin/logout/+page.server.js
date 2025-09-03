import { logoutByToken } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
  const token = cookies.get('session');
  if (token) await logoutByToken(token);
  cookies.delete('session', { path: '/' });
  throw redirect(302, '/');
}
