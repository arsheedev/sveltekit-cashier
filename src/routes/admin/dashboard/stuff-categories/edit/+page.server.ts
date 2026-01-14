import { PUBLIC_API_URL } from '$env/static/public';
import formParser from '$lib/form-parser';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Schema untuk validasi
import { z } from 'zod';

const CategorySchema = z.object({
	name: z.string().min(1, 'Category name is required').max(100, 'Category name is too long')
});

export const load: PageServerLoad = async ({ fetch, url, cookies }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		throw redirect(302, '/admin/dashboard/stuff-categories');
	}

	const token = cookies.get('token');
	const res = await fetch(`${PUBLIC_API_URL}/api/type-stuff/${id}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : {}
	});

	const result = await res.json();

	if (!result.success || !result.data) {
		throw redirect(303, '/admin/dashboard/stuff-categories');
	}

	return {
		category: result.data
	};
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies, url }) => {
		const id = url.searchParams.get('id');
		
		if (!id) {
			return fail(400, {
				message: 'Category ID is required!'
			});
		}

		const formData = await request.formData();
		const parsedForm = formParser(['name'], formData);
		
		const form = CategorySchema.safeParse(parsedForm);

		if (form.error) {
			return fail(400, {
				message: 'Invalid category name!',
				formIssues: form.error.issues
			});
		}

		const token = cookies.get('token');

		const res = await fetch(`${PUBLIC_API_URL}/api/type-stuff/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: JSON.stringify(form.data)
		});

		const result = await res.json();

		if (!res.ok || !result.success) {
			return fail(res.status || 500, {
				message: result.message || 'Failed to update category'
			});
		}

		throw redirect(302, '/admin/dashboard/stuff-categories/list');
	}
};