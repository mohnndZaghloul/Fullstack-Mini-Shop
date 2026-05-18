"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAnon = exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("../config");
exports.supabaseAdmin = (0, supabase_js_1.createClient)(config_1.config.supabaseUrl, config_1.config.supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
exports.supabaseAnon = (0, supabase_js_1.createClient)(config_1.config.supabaseUrl, config_1.config.supabaseAnonKey);
//# sourceMappingURL=supabase.js.map