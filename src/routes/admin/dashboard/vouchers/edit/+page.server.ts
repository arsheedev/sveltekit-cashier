import { PUBLIC_API_URL } from '$env/static/public';
import formParser from '$lib/form-parser';
import VoucherSchema from '$lib/schemas/voucher-schema';
import type { Response } from '$lib/types/response';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		throw redirect(302, '/admin/dashboard/vouchers');
	}

	const res = await fetch(`${PUBLIC_API_URL}/api/voucher/${id}`);

	const result = await res.json();

	if (!result.success || !result.data) {
		throw redirect(303, '/admin/dashboard/vouchers');
	}

	return {
		voucher: result.data
	};
};

// Action update tetap sama seperti sebelumnya
export const actions: Actions = {
	default: async ({ request, fetch, cookies, url }) => {
		const id = url.searchParams.get('id');
		const formData = await request.formData();
		const parsedForm = formParser(
			['code', 'type', 'discountValue', 'description', 'pointsRequired'],
			formData
		);
		const form = VoucherSchema.safeParse(parsedForm);

		if (form.error) {
			return fail(400, {
				message: 'Invalid username or password input!',
				formIssues: form.error.issues
			});
		}

		const token = cookies.get('token');

		const res = await fetch(`${PUBLIC_API_URL}/api/voucher/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: JSON.stringify(form.data)
		});

		const result: Response = await res.json();

		if (!res.ok || !result.success) {
			return fail(res.status || 500, {
				message: result.message
			});
		}

		return redirect(302, '/admin/dashboard/vouchers');
	}
};
