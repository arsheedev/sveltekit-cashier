import { PUBLIC_API_URL } from '$env/static/public';
import type { Actions } from '@sveltejs/kit';

interface Response {
	success: boolean;
	message: string;
	token: string;
}

export const actions: Actions = {
	default: async ({ fetch, cookies, request }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		const fetchData = await fetch(`${PUBLIC_API_URL}/api/auth/admin/login`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		const res: Response = await fetchData.json();

		if (res.success) {
			cookies.set('token', res.token, { httpOnly: true, path: '/' });
		}

		return { username, password, response: res };
	}
};