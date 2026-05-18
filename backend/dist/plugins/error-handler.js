"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandlerPlugin;
const zod_1 = require("zod");
async function errorHandlerPlugin(fastify) {
    fastify.setErrorHandler((error, request, reply) => {
        if (error instanceof zod_1.ZodError) {
            reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
            });
            return;
        }
        const fastifyError = error;
        if (fastifyError.statusCode === 401) {
            reply.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: error.message || 'Unauthorized',
            });
            return;
        }
        if (fastifyError.statusCode === 403) {
            reply.status(403).send({
                statusCode: 403,
                error: 'Forbidden',
                message: error.message || 'Forbidden',
            });
            return;
        }
        if (fastifyError.statusCode === 404) {
            reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: error.message || 'Resource not found',
            });
            return;
        }
        const statusCode = fastifyError.statusCode || 500;
        reply.status(statusCode).send({
            statusCode,
            error: statusCode >= 500 ? 'Internal Server Error' : 'Error',
            message: statusCode >= 500 ? 'An unexpected error occurred' : error.message,
        });
    });
}
//# sourceMappingURL=error-handler.js.map