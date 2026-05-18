import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  image_url: z.string().url('Must be a valid URL'),
  category_id: z.string().uuid('Invalid category ID'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  image_url: z.string().url().optional(),
  category_id: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
