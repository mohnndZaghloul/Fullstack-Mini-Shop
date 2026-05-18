import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { supabaseAdmin } from '../lib/supabase';

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get('/categories', async (_request: FastifyRequest, reply: FastifyReply) => {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message,
      });
      return;
    }

    reply.send(categories);
  });

  fastify.get('/categories/:slug/products', async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*, categories!inner(name, slug)')
      .is('deleted_at', null)
      .eq('is_active', true)
      .eq('categories.slug', slug)
      .order('created_at', { ascending: false });

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
}
