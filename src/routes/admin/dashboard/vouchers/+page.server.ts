import { PUBLIC_API_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const token = cookies.get('token');
	const page = Number(url.searchParams.get('page')) || 1;
	const limit = 10;

	try {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		const res = await fetch(`${PUBLIC_API_URL}/api/voucher?${params}`, {
			headers: {
				...(token && { Authorization: `Bearer ${token}` })
			}
		});

		const result = await res.json();

		if (!res.ok || !result.success) {
			return {
				vouchers: [],
				pagination: { current: page, total: 0, totalPages: 1 },
				error: result.message || 'Failed to load vouchers'
			};
		}

		return {
			vouchers: result.data || [],
			pagination: result.pagination || { current: page, total: 0, totalPages: 1 }
		};
	} catch (err) {
		return {
			vouchers: [],
			pagination: { current: 1, total: 0, totalPages: 1 },
			error: 'Unable to connect to server'
		};
	}
};

export const actions: Actions = {
	delete: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { message: 'Voucher ID is required' });
		}

		const token = cookies.get('token');

		const res = await fetch(`${PUBLIC_API_URL}/api/voucher/${id}`, {
			method: 'DELETE',
			headers: {
				...(token && { Authorization: `Bearer ${token}` })
			}
		});

		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return fail(res.status || 500, { message: err.message || 'Failed to delete voucher' });
		}

		return {
			success: true,
			message: 'Voucher deleted successfully'
		};
	}
};