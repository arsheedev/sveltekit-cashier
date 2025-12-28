import { PUBLIC_API_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ fetch, cookies, request }) => {
		const formData = await request.formData();

		const code = formData.get('code')?.toString().trim().toUpperCase() || '';
		const type = formData.get('type')?.toString().trim() || '';
		const discountValueStr = formData.get('discountValue')?.toString().trim();
		const description = formData.get('description')?.toString().trim() || '';
		const pointsRequiredStr = formData.get('pointsRequired')?.toString().trim();

		// Validasi manual sederhana (mirip login, cukup cek wajib isi)
		if (!code || code.length < 3) {
			return fail(400, {
				message: 'Code minimal 3 karakter dan wajib diisi',
				code,
				type,
				discountValue: discountValueStr || '',
				description,
				pointsRequired: pointsRequiredStr || '0'
			});
		}

		if (!type || !['fixed', 'percentage', 'manual_upgrade'].includes(type.toLowerCase())) {
			return fail(400, {
				message: 'Type harus dipilih dengan benar',
				code,
				type,
				discountValue: discountValueStr || '',
				description,
				pointsRequired: pointsRequiredStr || '0'
			});
		}

		if (!description) {
			return fail(400, {
				message: 'Description wajib diisi',
				code,
				type,
				discountValue: discountValueStr || '',
				description,
				pointsRequired: pointsRequiredStr || '0'
			});
		}

		// Konversi number (kalau kosong jadi 0 atau null sesuai kebutuhan)
		const discountValue = discountValueStr ? parseInt(discountValueStr, 10) : 0;
		const pointsRequired = pointsRequiredStr ? parseInt(pointsRequiredStr, 10) : 0;

		if (discountValueStr && (isNaN(discountValue) || discountValue < 0)) {
			return fail(400, {
				message: 'Discount value harus angka positif',
				code,
				type,
				discountValue: discountValueStr,
				description,
				pointsRequired: pointsRequiredStr || '0'
			});
		}

		if (pointsRequiredStr && (isNaN(pointsRequired) || pointsRequired < 0)) {
			return fail(400, {
				message: 'Points required harus angka positif',
				code,
				type,
				discountValue: discountValueStr || '',
				description,
				pointsRequired: pointsRequiredStr
			});
		}

		// Body yang dikirim ke API
		const body = {
			code,
			type: type.toLowerCase(),
			discountValue: discountValue || null, // atau 0 kalau kamu mau
			description,
			pointsRequired
		};

		const token = cookies.get('token');

		const res = await fetch(`${PUBLIC_API_URL}/api/voucher`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: JSON.stringify(body)
		});

		const result = await res.json();

		if (!res.ok || !result.success) {
			return fail(res.status || 500, {
				message: result.message || result.error || 'Gagal menambah voucher',
				code,
				type,
				discountValue: discountValueStr || '',
				description,
				pointsRequired: pointsRequiredStr || '0'
			});
		}

		// Sukses
		return {
			success: true,
			message: result.message || 'Voucher berhasil ditambahkan'
		};
	}
};