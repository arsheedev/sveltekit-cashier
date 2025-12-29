import { PUBLIC_API_URL } from '$env/static/public';
import formParser from '$lib/form-parser';
import StuffSchema from '$lib/schemas/stuff-schema';
import type { Response } from '$lib/types/response';
import type { Stuff } from '$lib/types/stuff';
import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface Res extends Response {
	data?: Stuff;
}

interface ResActions extends Response {
	url: string;
}

export const load: PageServerLoad = async ({ fetch, url }) => {
	const id = url.searchParams.get('id');
	const fetchData = await fetch(`${PUBLIC_API_URL}/api/stuff/${id}`);
	const res: Res = await fetchData.json();

	if (res.data) {
		return { product: res.data };
	}

	return redirect(302, '/admin/dashboard/products');
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch, url }) => {
		const token = cookies.get('token');
		const formData = await request.formData();

		if (formData.get('image')) {
			const imageFetch = await fetch(`${PUBLIC_API_URL}/api/upload/image`, {
				method: 'POST',
				headers: {
					...(token && { Authorization: `Bearer ${token}` })
				},
				body: formData
			});
			const imageRes: ResActions = await imageFetch.json();

			if (imageRes.success && imageRes.url) {
				formData.set('image', imageRes.url);
			} else {
				formData.delete('image');
			}
		} else {
			formData.delete('image');
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

		const res = await fetch(`${PUBLIC_API_URL}/api/stuff/${url.searchParams.get('id')}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` })
			},
			body: form.data.imageUrl
				? JSON.stringify(form.data)
				: JSON.stringify({ name: form.data.name, price: form.data.price, type: form.data.type })
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
