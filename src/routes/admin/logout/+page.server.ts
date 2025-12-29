import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: ({ cookies }) => {
		cookies.delete('token', { path: '/' });

		return redirect(302, '/admin/login');
	}
};
