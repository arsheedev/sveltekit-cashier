// src/lib/schemas/type-stuff-schema.ts
import { z } from 'zod';

const TypeStuffSchema = z.object({
  name: z.string().min(1, "Type name is required"),
});

export default TypeStuffSchema;