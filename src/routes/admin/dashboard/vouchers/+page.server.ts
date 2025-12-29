import { PUBLIC_API_URL } from '$env/static/public';
import type { Response } from '$lib/types/response';
import type { Voucher } from '$lib/types/voucher';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface Res extends Response {
	data: Voucher[];
}

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchData = await fetch(`${PUBLIC_API_URL}/api/voucher`);
	const res: Res = await fetchData.json();

	return { vouchers: res.data };
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, { message: 'Voucher ID is required' });
		}

		const token = cookies.get('token');

		const res = await fetch(`${PUBLIC_API_URL}/api/voucher/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`
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
