"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = productRoutes;
const supabase_1 = require("../lib/supabase");
const product_1 = require("../schemas/product");
async function productRoutes(fastify) {
    fastify.get('/products', async (request, reply) => {
        const query = product_1.productQuerySchema.parse(request.query);
        let dbQuery = supabase_1.supabaseAdmin
            .from('products')
            .select(`
        *,
        categories!inner(name, slug)
      `)
            .is('deleted_at', null)
            .eq('is_active', true);
        if (query.search) {
            dbQuery = dbQuery.ilike('name', `%${query.search}%`);
        }
        if (query.category) {
            dbQuery = dbQuery.eq('categories.slug', query.category);
        }
        dbQuery = dbQuery.order('created_at', { ascending: false });
        const { data: products, error } = await dbQuery;
        if (error) {
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: error.message,
            });
            return;
        }
        reply.send(products);
    });
    fastify.get('/products/:id', async (request, reply) => {
        const { id } = request.params;
        const { data: product, error } = await supabase_1.supabaseAdmin
            .from('products')
            .select(`
        *,
        categories(name, slug)
      `)
            .eq('id', id)
            .is('deleted_at', null)
            .single();
        if (error || !product) {
            reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            });
            return;
        }
        reply.send(product);
    });
    fastify.post('/products', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        if (request.user.role !== 'admin') {
            reply.status(403).send({
                statusCode: 403,
                error: 'Forbidden',
                message: 'Admin access required',
            });
            return;
        }
        const body = product_1.createProductSchema.parse(request.body);
        const { data: product, error } = await supabase_1.supabaseAdmin
            .from('products')
            .insert({
            name: body.name,
            description: body.description,
            price: body.price,
            image_url: body.image_url,
            category_id: body.category_id,
        })
            .select()
            .single();
        if (error) {
            reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: error.message,
            });
            return;
        }
        reply.status(201).send(product);
    });
    fastify.patch('/products/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        if (request.user.role !== 'admin') {
            reply.status(403).send({
                statusCode: 403,
                error: 'Forbidden',
                message: 'Admin access required',
            });
            return;
        }
        const { id } = request.params;
        const body = product_1.updateProductSchema.parse(request.body);
        const { data: product, error } = await supabase_1.supabaseAdmin
            .from('products')
            .update(body)
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error || !product) {
            reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            });
            return;
        }
        reply.send(product);
    });
    fastify.delete('/products/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        if (request.user.role !== 'admin') {
            reply.status(403).send({
                statusCode: 403,
                error: 'Forbidden',
                message: 'Admin access required',
            });
            return;
        }
        const { id } = request.params;
        const { data: product, error } = await supabase_1.supabaseAdmin
            .from('products')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
            .is('deleted_at', null)
            .select()
            .single();
        if (error || !product) {
            reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: 'Product not found',
            });
            return;
        }
        reply.send({ message: 'Product deleted' });
    });
}
//# sourceMappingURL=products.js.map