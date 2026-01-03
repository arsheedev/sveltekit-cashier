import { PUBLIC_API_URL } from '$env/static/public';
import formParser from '$lib/form-parser';
import StuffSchema from '$lib/schemas/stuff-schema';
import type { Response } from '$lib/types/response';
import { fail, redirect, type Actions } from '@sveltejs/kit';

interface Res extends Response {
	url?: string;
}

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const token = cookies.get('token');
		const formData = await request.formData();

		const imageFetch = await fetch(`${PUBLIC_API_URL}/api/upload/image`, {
			method: 'POST',
			headers: {
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: formData
		});
		const imageRes: Res = await imageFetch.json();

		if (imageRes.success && imageRes.url) {
			formData.set('image', imageRes.url);
		} else {
			formData.set('image', '');
		}

		const { image, ...parsedForm } = formParser(['name', 'price', 'type', 'image'], formData);
		const form = StuffSchema.safeParse({ ...parsedForm, imageUrl: image });

		if (form.error) {
			return fail(400, {
				success: false,
				message: '',
				formIssues: form.error.issues
			});
		}
		
		const res = await fetch(`${PUBLIC_API_URL}/api/stuff`, {
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

		return redirect(302, '/admin/dashboard/products/showcase');
	}
};
