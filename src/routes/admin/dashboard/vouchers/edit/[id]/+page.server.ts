import { PUBLIC_API_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params, cookies }) => {
	const id = params.id;
	const token = cookies.get('token');

	if (!id) {
		throw redirect(303, '/admin/vouchers');
	}

	try {
		const res = await fetch(`${PUBLIC_API_URL}/api/voucher/${id}`, {
			headers: {
				...(token && { Authorization: `Bearer ${token}` })
			}
		});

		const result = await res.json();

		if (!res.ok) {
			// Kalau API error (404, 401, dll), langsung redirect ke list dengan pesan
			throw redirect(303, '/admin/vouchers');
		}

		if (!result.success || !result.data) {
			throw redirect(303, '/admin/vouchers');
		}

		return {
			voucher: result.data
		};
	} catch (err) {
		// Kalau ada error jaringan atau lainnya, redirect ke list
		throw redirect(303, '/admin/vouchers');
	}
};

// Action update tetap sama seperti sebelumnya
export const actions: Actions = {
	default: async ({ request, fetch, cookies, params }) => {
		const id = params.id;
		const formData = await request.formData();

		const code = formData.get('code')?.toString().trim().toUpperCase() || '';
		const type = formData.get('type')?.toString().trim() || '';
		const discountValueStr = formData.get('discountValue')?.toString().trim();
		const description = formData.get('description')?.toString().trim() || '';
		const pointsRequiredStr = formData.get('pointsRequired')?.toString().trim();

		if (!code || code.length < 3) {
			return fail(400, { message: 'Code must be at least 3 characters', code, type, discountValue: discountValueStr || '', description, pointsRequired: pointsRequiredStr || '0' });
		}

		if (!type || !['fixed', 'percentage', 'manual_upgrade'].includes(type.toLowerCase())) {
			return fail(400, { message: 'Invalid voucher type', code, type, discountValue: discountValueStr || '', description, pointsRequired: pointsRequiredStr || '0' });
		}

		if (!description) {
			return fail(400, { message: 'Description is required', code, type, discountValue: discountValueStr || '', description, pointsRequired: pointsRequiredStr || '0' });
		}

		const discountValue = discountValueStr ? parseInt(discountValueStr, 10) : 0;
		const pointsRequired = pointsRequiredStr ? parseInt(pointsRequiredStr, 10) : 0;

		const body = {
			code,
			type: type.toLowerCase(),
			discountValue: discountValue || null,
			description,
			pointsRequired
		};

		const token = cookies.get('token');

		const res = await fetch(`${PUBLIC_API_URL}/api/voucher/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: JSON.stringify(body)
		});

		const result = await res.json();

		if (!res.ok || !result.success) {
			return fail(res.status || 500, {
				message: result.message || result.error || 'Failed to update voucher',
				code,
				type,
				discountValue: discountValueStr || '',
				description,
				pointsRequired: pointsRequiredStr || '0'
			});
		}

		return {
			success: true,
			message: 'Voucher updated successfully'
		};
	}
};