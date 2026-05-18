"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const supabase_1 = require("../lib/supabase");
exports.default = (0, fastify_plugin_1.default)(async function authPlugin(fastify) {
    fastify.decorate('authenticate', async function (request, reply) {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            reply.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header',
            });
            return;
        }
        const token = authHeader.substring(7);
        try {
            const { data, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
            if (error || !data.user) {
                reply.status(401).send({
                    statusCode: 401,
                    error: 'Unauthorized',
                    message: 'Invalid or expired token',
                });
                return;
            }
            const { data: profile } = await supabase_1.supabaseAdmin
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();
            request.user = {
                id: data.user.id,
                email: data.user.email || '',
                role: profile?.role || 'customer',
            };
        }
        catch {
            reply.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Invalid token',
            });
        }
    });
    fastify.decorateRequest('user', { id: '', email: '', role: 'customer' });
});
//# sourceMappingURL=auth.js.map