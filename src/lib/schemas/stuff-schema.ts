import { z } from 'zod';

const StuffSchema = z.object({
	name: z.string().min(1, 'Name is required~'),
	price: z.coerce.number().positive('Price must be a positive value!'),
	type: z.string().min(1, 'Type is required!'),
	imageUrl: z.string().nullable().optional()
});

export default StuffSchema;
