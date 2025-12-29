import { PUBLIC_API_URL } from '$env/static/public';
import formParser from '$lib/form-parser';
import VoucherSchema from '$lib/schemas/voucher-schema';
import type { Response } from '$lib/types/response';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ fetch, cookies, request }) => {
		const formData = await request.formData();
		const parsedForm = formParser(
			['code', 'type', 'discountValue', 'description', 'pointsRequired'],
			formData
		);
		const form = VoucherSchema.safeParse(parsedForm);

		if (form.error) {
			return fail(400, {
				success: false,
				message: 'Invalid username or password input!',
				formIssues: form.error.issues
			});
		}

		const token = cookies.get('token');

		const res = await fetch(`${PUBLIC_API_URL}/api/voucher`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: JSON.stringify(form.data)
		});

		const result: Response = await res.json();

		if (!res.ok || !result.success) {
			return fail(res.status || 500, {
				success: false,
				message: result.message
			});
		}

		// Sukses
		return {
			success: true,
			message: result.message || 'Voucher berhasil ditambahkan'
		};
	}
};
