// New menu item (server)
import { query } from '$lib/db/mysql';
import { redirect, fail } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

export const load = async ({ locals }) => {
  if (!locals.user) throw redirect(302, '/admin/login');

  try {
    const categories = await query('SELECT id, name FROM menu_categories ORDER BY name', []);
    return { categories };
  } catch (err) {
    console.error('load categories:', err);
    return { categories: [] };
  }
};

export const actions = {
  addItem: async ({ request, locals }) => {
    if (!locals.user) throw redirect(302, '/admin/login');

    const fd = await request.formData();
    const category_id = Number(fd.get('category_id'));
    const name = fd.get('name')?.toString().trim();
    const description = fd.get('description')?.toString().trim() || null;
    const price = Number(fd.get('price'));
    const image = fd.get('image');

    if (!category_id || !name || !Number.isFinite(price) || price < 0) {
      return fail(400, { ok: false, message: 'Please fill all required fields correctly.' });
    }

    let image_url = null;

    try {
      if (image && typeof image === 'object' && image.size > 0) {
        if (image.size > MAX_IMAGE_BYTES) {
          return fail(400, { ok: false, message: 'Image must be ≤ 5MB.' });
        }
        if (!ALLOWED_TYPES.has(image.type)) {
          return fail(400, { ok: false, message: 'Only JPG, PNG, WebP, or AVIF allowed.' });
        }

        const safe = image.name.replace(/[^\w.\-]+/g, '_').slice(-80);
        const key = `menu/${Date.now()}-${safe}`;

        const { url } = await put(key, image, {
          access: 'public',
          contentType: image.type,
          token: BLOB_READ_WRITE_TOKEN
        });

        image_url = url;
      }

      await query(
        'INSERT INTO menu_items (category_id, name, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
        [category_id, name, description, price, image_url]
      );

      return { ok: true, message: 'Menu item added.' };
    } catch (err) {
      console.error('addItem:', err);
      return fail(500, { ok: false, message: 'Server error. Please try again.' });
    }
  }
};
