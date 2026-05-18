import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config';
import authPlugin from './plugins/auth';
import errorHandlerPlugin from './plugins/error-handler';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import categoryRoutes from './routes/categories';

async function main() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(errorHandlerPlugin);

  await fastify.register(authPlugin);

  await fastify.register(authRoutes);
  await fastify.register(productRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(categoryRoutes);

  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    fastify.log.info(`Server running on port ${config.port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main();
