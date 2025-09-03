// Load menu data and expose current user. Also includes a minimal reservation action.
import { query } from '$lib/db/mysql';
import { fail } from '@sveltejs/kit';

export async function load({ locals }) {
  // Fetch items and group by category in JS for clarity/maintainability
  const items = await query(
    `SELECT mi.id, mi.name, mi.description, mi.price, mi.image_url,
            mc.name AS category
       FROM menu_items mi
       JOIN menu_categories mc ON mi.category_id = mc.id
     ORDER BY mc.name, mi.name`,
    []
  );

  const menuByCategory = items.reduce((acc, it) => {
    (acc[it.category] ??= []).push(it);
    return acc;
  }, /** @type {Record<string, any[]>} */ ({}));

  return { user: locals.user ?? null, menuByCategory };
}

export const actions = {
  createReservation: async ({ request, locals }) => {
    const fd = await request.formData();
    const name = fd.get('name')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const phone = fd.get('phone')?.toString().trim() || null;
    const reservation_date = fd.get('reservation_date')?.toString();
    const party_size = Number(fd.get('party_size'));
    const special_requests = fd.get('special_requests')?.toString().trim() || null;

    if (!name || !email || !reservation_date || !Number.isFinite(party_size) || party_size < 1) {
      return fail(400, { ok: false, message: 'Please fill required fields correctly.' });
    }

    const user_id = locals.user?.id ?? null;

    try {
      await query(
        `INSERT INTO reservations
           (user_id, name, email, phone, reservation_date, party_size, special_requests)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, name, email, phone, reservation_date, party_size, special_requests]
      );
      return { ok: true, message: 'Reservation created. See you soon!' };
    } catch (err) {
      console.error('Reservation error:', err);
      return fail(500, { ok: false, message: 'Server error. Please try again.' });
    }
  }
};
