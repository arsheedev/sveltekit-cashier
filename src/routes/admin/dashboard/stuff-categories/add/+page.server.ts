// src/routes/admin/dashboard/categories/new/+page.server.ts

import { PUBLIC_API_URL } from '$env/static/public';
import TypeStuffSchema from '$lib/schemas/type-stuff-schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const token = cookies.get('token');
    if (!token) {
      return fail(401, { 
        success: false, 
        message: 'Please login as admin first' 
      });
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString()?.trim() || '';

    const parseResult = TypeStuffSchema.safeParse({ name });
    if (!parseResult.success) {
      return fail(400, {
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors
      });
    }

    const response = await fetch(`${PUBLIC_API_URL}/api/type-stuff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return fail(response.status || 500, {
        success: false,
        message: result.message || 'Failed to add category'
      });
    }

    throw redirect(302, '/admin/dashboard/stuff-categories/list');
  }
};