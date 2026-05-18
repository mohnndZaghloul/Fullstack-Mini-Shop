"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = orderRoutes;
const supabase_1 = require("../lib/supabase");
const order_1 = require("../schemas/order");
async function orderRoutes(fastify) {
    fastify.post('/orders', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { items } = order_1.createOrderSchema.parse(request.body);
        const productIds = items.map((item) => item.product_id);
        const { data: products, error: productError } = await supabase_1.supabaseAdmin
            .from('products')
            .select('id, price')
            .in('id', productIds)
            .is('deleted_at', null)
            .eq('is_active', true);
        if (productError) {
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: productError.message,
            });
            return;
        }
        if (!products || products.length !== items.length) {
            reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: 'One or more products not found or inactive',
            });
            return;
        }
        const priceMap = new Map(products.map((p) => [p.id, p.price]));
        let totalAmount = 0;
        for (const item of items) {
            const price = priceMap.get(item.product_id) || 0;
            totalAmount += price * item.quantity;
        }
        const { data: order, error: orderError } = await supabase_1.supabaseAdmin
            .from('orders')
            .insert({
            user_id: request.user.id,
            total_amount: totalAmount,
            status: 'pending',
        })
            .select()
            .single();
        if (orderError) {
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: orderError.message,
            });
            return;
        }
        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: priceMap.get(item.product_id) || 0,
        }));
        const { error: itemsError } = await supabase_1.supabaseAdmin
            .from('order_items')
            .insert(orderItems);
        if (itemsError) {
            await supabase_1.supabaseAdmin.from('orders').delete().eq('id', order.id);
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: itemsError.message,
            });
            return;
        }
        const { data: fullOrder } = await supabase_1.supabaseAdmin
            .from('orders')
            .select(`
          *,
          order_items(*)
        `)
            .eq('id', order.id)
            .single();
        reply.status(201).send(fullOrder);
    });
    fastify.get('/orders/my', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { data: orders, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .select(`
          *,
          order_items(*)
        `)
            .eq('user_id', request.user.id)
            .order('created_at', { ascending: false });
        if (error) {
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: error.message,
            });
            return;
        }
        reply.send(orders);
    });
    fastify.get('/orders', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        if (request.user.role !== 'admin') {
            reply.status(403).send({
                statusCode: 403,
                error: 'Forbidden',
                message: 'Admin access required',
            });
            return;
        }
        const { page, limit } = order_1.paginationSchema.parse(request.query);
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data: orders, error, count } = await supabase_1.supabaseAdmin
            .from('orders')
            .select(`
          *,
          order_items(*)
        `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);
        if (error) {
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: error.message,
            });
            return;
        }
        reply.send({
            data: orders,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: count ? Math.ceil(count / limit) : 0,
            },
        });
    });
    fastify.patch('/orders/:id/status', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        if (request.user.role !== 'admin') {
            reply.status(403).send({
                statusCode: 403,
                error: 'Forbidden',
                message: 'Admin access required',
            });
            return;
        }
        const { id } = request.params;
        const { status } = order_1.updateOrderStatusSchema.parse(request.body);
        const { data: order, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error || !order) {
            reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: 'Order not found',
            });
            return;
        }
        reply.send(order);
    });
}
//# sourceMappingURL=orders.js.map