import { PUBLIC_API_URL } from '$env/static/public';
import type { Response } from '$lib/types/response';
import type { Stuff } from '$lib/types/stuff';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface Res extends Response {
	data: Stuff[];
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');
	const fetchData = await fetch(`${PUBLIC_API_URL}/api/stuff`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});
	const response: Res = await fetchData.json();

	return { stuff: response.data || [] };
};

export const actions: Actions = {
	delete: async ({ request, fetch, cookies }) => {
		const token = cookies.get('token');
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, {
				success: false,
				message: 'Product ID is required'
			});
		}

		const res = await fetch(`${PUBLIC_API_URL}/api/stuff/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			}
		});

		const result: Response = await res.json();

		if (!res.ok || !result.success) {
			return fail(res.status || 500, {
				success: false,
				message: result.message || 'Failed to delete product'
			});
		}

		// Redirect dengan status sukses
		throw redirect(303, '/admin/dashboard/products/showcase?success=' + encodeURIComponent(result.message || 'Product deleted successfully'));
	}
};