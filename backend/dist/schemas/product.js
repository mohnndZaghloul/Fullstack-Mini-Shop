"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(200),
    description: zod_1.z.string().min(1, 'Description is required'),
    price: zod_1.z.number().positive('Price must be positive'),
    image_url: zod_1.z.string().url('Must be a valid URL'),
    category_id: zod_1.z.string().uuid('Invalid category ID'),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200).optional(),
    description: zod_1.z.string().min(1).optional(),
    price: zod_1.z.number().positive().optional(),
    image_url: zod_1.z.string().url().optional(),
    category_id: zod_1.z.string().uuid().optional(),
    is_active: zod_1.z.boolean().optional(),
});
exports.productQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
});
//# sourceMappingURL=product.js.map