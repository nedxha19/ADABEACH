import { query } from '$lib/db/mysql';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit'; // Import fail for action error responses

// Load main page data
export async function load({ locals }) {
    try {
  
        const menuItems = await query(`
            SELECT mi.*, mc.name as category_name 
            FROM menu_items mi 
            JOIN menu_categories mc ON mi.category_id = mc.id 
            ORDER BY mc.name, mi.name
        `, []);

        // Group menu items by category for display
        const menuByCategory = {};
        menuItems.forEach(item => {
            if (!menuByCategory[item.category_name]) {
                menuByCategory[item.category_name] = [];
            }
            menuByCategory[item.category_name].push(item);
        });

        return { 
            menuByCategory,
            user: locals.user 
        };
    } catch (error) {
        console.error('Error loading menu data:', error);
        throw new Error('Failed to load menu data');
    }
}

// Handle page actions
export const actions = {
    // Create a new reservation
    createReservation: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const phone = formData.get('phone')?.trim();
        const reservation_date = formData.get('reservation_date');
        const party_size = parseInt(formData.get('party_size'), 10);
        const special_requests = formData.get('special_requests')?.trim();
        
        // Basic validation
        if (!name || !email || !reservation_date || isNaN(party_size) || party_size < 1) {
            return fail(400, {
                success: false,
                message: 'Invalid input: Required fields are missing or invalid.'
            });
        }

        // Get user ID if logged in
        const user_id = locals.user ? locals.user.id : null;

        try {
            // Use the query helper for efficient execution
            await query(
                'INSERT INTO reservations (user_id, name, email, phone, reservation_date, party_size, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user_id, name, email, phone, reservation_date, party_size, special_requests]
            );

            return {
                success: true,
                message: 'Reservation created successfully!'
            };
        } catch (error) {
            console.error('Error creating reservation:', error);
            return fail(500, {
                success: false,
                message: 'Failed to create reservation due to a server error.'
            });
        }
    }
};