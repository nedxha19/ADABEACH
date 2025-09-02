// New menu item upload page server
import { query } from '$lib/db/mysql';
import { redirect, error } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

// Load page data
export const load = async ({ locals }) => {
    // Check if user is logged in
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    try {
        const categories = await query('SELECT * FROM menu_categories ORDER BY name');
        return {
            categories,
            user: locals.user
        };
    } catch (err) {
        console.error('Error loading categories:', err);
        return {
            categories: [],
            user: locals.user,
            error: 'Failed to load categories'
        };
    }
};

// Handle form actions
export const actions = {
    addItem: async ({ request }) => {
        const formData = await request.formData();
        const category_id = formData.get('category_id');
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const imageFile = formData.get('image');

        // Validate required fields
        if (!name || !description || !price || !category_id) {
            throw error(400, { message: 'Missing required fields' });
        }

        let image_url = null;

        try {
            // Handle image upload
            if (imageFile && imageFile.size > 0) {
                const timestamp = Date.now();
                const safeName = imageFile.name.replace(/\s+/g, '_');
                const uniquePath = `menu_upload/${timestamp}-${safeName}`;

                const { url } = await put(uniquePath, imageFile, {
                    access: 'public',
                    token: BLOB_READ_WRITE_TOKEN
                });

                image_url = url;
            }

            // Save menu item in DB
            await query(
                'INSERT INTO menu_items (category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
                [category_id, name, description, price, image_url]
            );

            return { success: true, message: 'Menu item added successfully' };
        } catch (err) {
            console.error('Error adding menu item:', err);
            return { success: false, error: 'Failed to add menu item' };
        }
    }
};
