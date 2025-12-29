import { PUBLIC_API_URL } from '$env/static/public';
import formParser from '$lib/form-parser';
import AdminSchema from '$lib/schemas/admin-schema';
import type { Response } from '$lib/types/response';
import { fail, redirect, type Actions } from '@sveltejs/kit';

interface Res extends Response {
	token: string;
}

export const actions: Actions = {
	default: async ({ fetch, cookies, request }) => {
		const formData = await request.formData();
		const parsedForm = formParser(['username', 'password'] as const, formData);
		const form = AdminSchema.safeParse(parsedForm);

		if (form.error) {
			return fail(400, {
				message: 'Invalid username or password input!',
				formIssues: form.error.issues
			});
		}

		const { username, password } = form.data;

		const fetchData = await fetch(`${PUBLIC_API_URL}/api/auth/admin/login`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username, password })
		});
		const res: Res = await fetchData.json();

		if (!res.success) {
			return fail(400, { message: res.message });
		}

		cookies.set('token', res.token, { path: '/' });

		return redirect(302, '/admin/dashboard');
	}
};
