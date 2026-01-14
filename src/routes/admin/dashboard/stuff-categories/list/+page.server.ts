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
  const fetchData = await fetch(`${PUBLIC_API_URL}/api/type-stuff`);
  const res: Res = await fetchData.json();
  return { typeStuffs: res.data };
};

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    if (!id) {
      return fail(400, { message: 'ID kategori diperlukan untuk menghapus' });
    }

    const token = cookies.get('token');

    const response = await fetch(`${PUBLIC_API_URL}/api/type-stuff/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return fail(response.status || 500, {
        message: err.message || 'Gagal menghapus kategori stuff'
      });
    }

    return {
      success: true,
      message: 'Kategori berhasil dihapus'
    };
  }
};