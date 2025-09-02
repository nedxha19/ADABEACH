import { register } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    // Redirect if already logged in
    if (locals.user) {
        throw redirect(302, '/admin/gallery');
    }
}

export const actions = {
    register: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Basic validation
        if (!email || !username || !password) {
            return { success: false, message: 'All fields are required' };
        }
        
        if (password !== confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }
        
        if (password.length < 8) {
            return { success: false, message: 'Password must be at least 8 characters' };
        }
        
        // Attempt registration
        const result = await register(email, username, password);
        
        if (result.success) {
            // Set session cookie
            cookies.set('session', result.token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
            
            throw redirect(303, '/admin/gallery');
        }
        
        return result;
    }
};