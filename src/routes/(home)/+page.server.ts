import { PUBLIC_API_URL } from '$env/static/public';
import type { Response } from '$lib/types/response';
import type { Stuff } from '$lib/types/stuff';
import type { PageServerLoad } from './$types';

interface ApiResponse extends Response {
  data: Stuff[];
}

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const res = await fetch(`${PUBLIC_API_URL}/api/stuff`);

    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      return { products: [] };
    }

    const response: ApiResponse = await res.json();

    if (!response.success) {
      console.error('API not success:', response.message);
      return { products: [] };
    }

    const products = response.data.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      type: item.type.toLowerCase() as 'food' | 'beverages' | 'all',
      imageUrl: item.imageUrl || '',
    }));

    return { products };
  } catch (error) {
    console.error('Failed to fetch menu from API:', error);
    return { products: [] };
  }
};