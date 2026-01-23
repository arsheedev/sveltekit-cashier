// src/routes/+layout.server.ts
import { PUBLIC_API_URL } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
  console.log('LAYOUT SERVER LOAD DIPANGGIL');

  try {
    const res = await fetch(`${PUBLIC_API_URL}/api/type-stuff`);
    if (!res.ok) return { typeStuffs: [] };

    const json = await res.json();
    const typeStuffs = json?.data || [];

    console.log('LAYOUT SERVER → Mengirim ke client:', typeStuffs.length, 'item');
    return { typeStuffs };
  } catch (err) {
    console.error('Error:', err);
    return { typeStuffs: [] };
  }
};