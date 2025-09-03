// Gallery (server): list, add category, update item, delete (single/bulk)
import { query } from '$lib/db/mysql';
import { redirect, fail } from '@sveltejs/kit';

export async function load({ locals }) {
  if (!locals.user) throw redirect(302, '/admin/login');

  try {
    const [items, categories] = await Promise.all([
      query(`
        SELECT mi.id, mi.name, mi.description, mi.price, mi.image_url, mc.name AS category_name, mc.id AS category_id
          FROM menu_items mi
          JOIN menu_categories mc ON mi.category_id = mc.id
        ORDER BY mc.name, mi.name`, []),
      query('SELECT id, name FROM menu_categories ORDER BY name', [])
    ]);

    return { items, categories };
  } catch (err) {
    console.error('gallery load:', err);
    return { items: [], categories: [] };
  }
}

export const actions = {
  addCategory: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, '/admin/login');
    const fd = await request.formData();
    const name = fd.get('name')?.toString().trim();
    const description = fd.get('description')?.toString().trim() || null;
    if (!name) return fail(400, { ok: false, message: 'Category name is required.' });

    try {
      await query('INSERT INTO menu_categories (name, description) VALUES (?, ?)', [name, description]);
      return { ok: true };
    } catch (err) {
      console.error('addCategory:', err);
      return fail(500, { ok: false, message: 'Could not add category.' });
    }
  },

  updateItem: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, '/admin/login');
    const fd = await request.formData();
    const id = Number(fd.get('id'));
    const name = fd.get('name')?.toString().trim();
    const description = fd.get('description')?.toString().trim() || null;
    const price = Number(fd.get('price'));
    const category_id = Number(fd.get('category_id'));

    if (!id || !name || !Number.isFinite(price) || price < 0 || !category_id) {
      return fail(400, { ok: false, message: 'Invalid data.' });
    }

    try {
      await query(
        'UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?',
        [name, description, price, category_id, id]
      );
      return { ok: true };
    } catch (err) {
      console.error('updateItem:', err);
      return fail(500, { ok: false, message: 'Could not update item.' });
    }
  },

  deleteItem: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, '/admin/login');
    const fd = await request.formData();
    const id = Number(fd.get('id'));
    if (!id) return fail(400, { ok: false, message: 'Invalid id.' });

    try {
      await query('DELETE FROM menu_items WHERE id = ?', [id]);
      return { ok: true };
    } catch (err) {
      console.error('deleteItem:', err);
      return fail(500, { ok: false, message: 'Could not delete item.' });
    }
  },

  bulkDelete: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, '/admin/login');
    const fd = await request.formData();
    const ids = (fd.getAll('ids') || []).map((v) => Number(v)).filter((n) => Number.isFinite(n));
    if (!ids.length) return fail(400, { ok: false, message: 'No items selected.' });

    // Build safe placeholders: (?, ?, ?)
    const placeholders = ids.map(() => '?').join(', ');
    try {
      await query(`DELETE FROM menu_items WHERE id IN (${placeholders})`, ids);
      return { ok: true, count: ids.length };
    } catch (err) {
      console.error('bulkDelete:', err);
      return fail(500, { ok: false, message: 'Bulk delete failed.' });
    }
  }
};
