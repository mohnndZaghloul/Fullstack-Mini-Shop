import { z } from 'zod';
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    image_url: z.ZodString;
    category_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
}, {
    name: string;
    description: string;
    price: number;
    image_url: string;
    category_id: string;
}>;
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    image_url: z.ZodOptional<z.ZodString>;
    category_id: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    image_url?: string | undefined;
    category_id?: string | undefined;
    is_active?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    image_url?: string | undefined;
    category_id?: string | undefined;
    is_active?: boolean | undefined;
}>;
export declare const productQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    category?: string | undefined;
}, {
    search?: string | undefined;
    category?: string | undefined;
}>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
//# sourceMappingURL=product.d.ts.map