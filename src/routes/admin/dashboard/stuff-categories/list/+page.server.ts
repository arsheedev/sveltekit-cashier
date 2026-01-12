// src/routes/kategori-stuff/+page.server.ts
import { PUBLIC_API_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface TypeStuff {
  id: string | number;
  name: string;
}

interface ResponseApi {
  success: boolean;
  message?: string;
  data: TypeStuff[];
}

interface Res extends ResponseApi {
  data: TypeStuff[];
}

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch(`${PUBLIC_API_URL}/api/type-stuff`);
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data kategori stuff');
    }

    const result: Res = await response.json();

    return {
      typeStuffs: result.data ?? []
    };
  } catch (error) {
    console.error('Error load type-stuff:', error);
    return {
      typeStuffs: [],
      error: 'Terjadi kesalahan saat mengambil data kategori'
    };
  }
};

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();

    if (!id) {
      return fail(400, { 
        success: false,
        message: 'ID kategori diperlukan untuk menghapus' 
      });
    }

    try {
      const token = cookies.get('token');

      if (!token) {
        return fail(401, { 
          success: false,
          message: 'Autentikasi diperlukan' 
        });
      }

      const response = await fetch(`${PUBLIC_API_URL}/api/type-stuff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return fail(response.status || 500, {
          success: false,
          message: errorData.message || 'Gagal menghapus kategori stuff'
        });
      }

      return {
        success: true,
        message: 'Kategori berhasil dihapus'
      };
    } catch (error) {
      console.error('Delete type-stuff error:', error);
      return fail(500, {
        success: false,
        message: 'Terjadi kesalahan server saat menghapus kategori'
      });
    }
  }
};