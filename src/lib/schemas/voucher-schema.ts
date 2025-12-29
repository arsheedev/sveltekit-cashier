import { z } from 'zod';

const VoucherSchema = z.object({
	code: z.string().min(3).toUpperCase().trim(),
	type: z.enum(['fixed', 'percentage', 'manual_upgrade']),
	discountValue: z.coerce.number().int().min(0).optional().default(0), // Cents or %
	description: z.string().min(1, 'Description is required!'),
	pointsRequired: z.coerce.number().min(0).default(0)
});

export default VoucherSchema;
