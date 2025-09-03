import { register } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
  if (locals.user) throw redirect(302, '/admin/gallery');
}

export const actions = {
  register: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.trim();
    const username = formData.get('username')?.trim();
    const password = formData.get('password')?.trim();
    const confirmPassword = formData.get('confirmPassword')?.trim();

    if (!email || !username || !password) {
      return { success: false, message: 'All fields are required' };
    }
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }
    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters' };
    }

    const result = await register(email, username, password);
    if (result.success) {
      cookies.set('session', result.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: true, // HTTPS
        maxAge: 60 * 60 * 24 * 7
      });
      throw redirect(303, '/admin/gallery');
    }
    return result;
  }
};
