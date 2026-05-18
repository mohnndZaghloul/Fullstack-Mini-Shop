"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const config_1 = require("./config");
const auth_1 = __importDefault(require("./plugins/auth"));
const error_handler_1 = __importDefault(require("./plugins/error-handler"));
const auth_2 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
async function main() {
    const fastify = (0, fastify_1.default)({
        logger: true,
    });
    await fastify.register(cors_1.default, {
        origin: true,
        credentials: true,
    });
    await fastify.register(error_handler_1.default);
    await fastify.register(auth_1.default);
    await fastify.register(auth_2.default);
    await fastify.register(products_1.default);
    await fastify.register(orders_1.default);
    fastify.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });
    try {
        await fastify.listen({ port: config_1.config.port, host: '0.0.0.0' });
        fastify.log.info(`Server running on port ${config_1.config.port}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map