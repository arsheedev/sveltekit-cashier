// src/routes/admin/dashboard/stuff/add/+page.server.ts
import { PUBLIC_API_URL } from '$env/static/public';
import formParser from '$lib/form-parser';
import StuffSchema from '$lib/schemas/stuff-schema';
import type { Response } from '$lib/types/response';
import { fail, redirect, type Actions, type PageServerLoad } from '@sveltejs/kit';

interface Res extends Response {
	url?: string;
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
    const token = cookies.get('token');
    
    // Fetch categories untuk dropdown
    const categoriesRes = await fetch(`${PUBLIC_API_URL}/api/type-stuff`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    const categories = await categoriesRes.json();
    
    return {
        categories: categories.success ? categories.data : []
    };
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const token = cookies.get('token');
		const formData = await request.formData();

		// Upload gambar jika ada
		let imageUrl = '';
		const imageFile = formData.get('image') as File;
		
		if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
			const imageFetch = await fetch(`${PUBLIC_API_URL}/api/upload/image`, {
				method: 'POST',
				headers: {
					...(token && { Authorization: `Bearer ${token}` })
				},
				body: formData
			});
			const imageRes: Res = await imageFetch.json();

			if (imageRes.success && imageRes.url) {
				imageUrl = imageRes.url;
			}
		}

		const parsedForm = formParser(['name', 'price', 'type'], formData);
		const form = StuffSchema.safeParse({ 
			...parsedForm, 
			imageUrl: imageUrl || null 
		});

		if (form.error) {
			return fail(400, {
				success: false,
				message: 'Invalid input!',
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