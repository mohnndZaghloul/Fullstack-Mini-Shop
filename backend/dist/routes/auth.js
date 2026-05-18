"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRoutes;
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../schemas/auth");
async function authRoutes(fastify) {
    fastify.post('/auth/register', async (request, reply) => {
        const { name, email, password } = auth_1.registerSchema.parse(request.body);
        const { data: authData, error: signUpError } = await supabase_1.supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { name },
        });
        if (signUpError) {
            reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: signUpError.message,
            });
            return;
        }
        if (!authData.user) {
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Failed to create user',
            });
            return;
        }
        const { error: profileError } = await supabase_1.supabaseAdmin.from('profiles').insert({
            id: authData.user.id,
            name,
            role: 'customer',
        });
        if (profileError) {
            await supabase_1.supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: profileError.message,
            });
            return;
        }
        const { data: signInData, error: signInError } = await supabase_1.supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });
        if (signInError || !signInData.session) {
            reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Failed to create session',
            });
            return;
        }
        reply.status(201).send({
            token: signInData.session.access_token,
            user: {
                id: authData.user.id,
                email: authData.user.email,
                name,
                role: 'customer',
            },
        });
    });
    fastify.post('/auth/login', async (request, reply) => {
        const { email, password } = auth_1.loginSchema.parse(request.body);
        const { data, error } = await supabase_1.supabaseAdmin.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            reply.status(401).send({
                statusCode: 401,
                error: 'Unauthorized',
                message: 'Invalid email or password',
            });
            return;
        }
        const { data: profile } = await supabase_1.supabaseAdmin
            .from('profiles')
            .select('name, role')
            .eq('id', data.user.id)
            .single();
        reply.send({
            token: data.session.access_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: profile?.name || '',
                role: profile?.role || 'customer',
            },
        });
    });
    fastify.post('/auth/forgot-password', async (request, reply) => {
        const { email } = auth_1.forgotPasswordSchema.parse(request.body);
        const { error } = await supabase_1.supabaseAdmin.auth.resetPasswordForEmail(email);
        if (error) {
            reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: error.message,
            });
            return;
        }
        reply.send({
            message: 'Password reset email sent',
        });
    });
    fastify.get('/auth/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const { data: profile, error } = await supabase_1.supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', request.user.id)
            .single();
        if (error || !profile) {
            reply.status(404).send({
                statusCode: 404,
                error: 'Not Found',
                message: 'Profile not found',
            });
            return;
        }
        reply.send({
            id: request.user.id,
            email: request.user.email,
            name: profile.name,
            role: profile.role,
            created_at: profile.created_at,
        });
    });
}
//# sourceMappingURL=auth.js.map