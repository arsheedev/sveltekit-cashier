import { PUBLIC_API_URL } from '$env/static/public';
import type { Response } from '$lib/types/response';
import type { Stuff } from '$lib/types/stuff';
import type { PageServerLoad } from '../$types';

interface Res extends Response {
	data: Stuff[];
}

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchData = await fetch(`${PUBLIC_API_URL}/api/stuff`);
	const response: Res = await fetchData.json();

	return { stuff: response.data };
};
