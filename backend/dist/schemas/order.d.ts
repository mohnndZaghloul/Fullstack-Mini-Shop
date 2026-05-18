import { z } from 'zod';
export declare const orderItemSchema: z.ZodObject<{
    product_id: z.ZodString;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    product_id: string;
    quantity: number;
}, {
    product_id: string;
    quantity: number;
}>;
export declare const createOrderSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        product_id: z.ZodString;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        product_id: string;
        quantity: number;
    }, {
        product_id: string;
        quantity: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        product_id: string;
        quantity: number;
    }[];
}, {
    items: {
        product_id: string;
        quantity: number;
    }[];
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "confirmed", "shipped", "delivered", "cancelled"]>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}, {
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
//# sourceMappingURL=order.d.ts.map