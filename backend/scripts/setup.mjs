const PROJECT = 'moolaxsrduqwyabzhkub';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vb2xheHNyZHVxd3lhYnpoa3ViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTA5NjUxOCwiZXhwIjoyMDk0NjcyNTE4fQ.s5lmNyVzbFaM6CS_CTbZEKpsaFlLDx1oZYqze2moNZA';
const BASE = `https://${PROJECT}.supabase.co`;
const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' };

async function setup() {
  // 1. Try reading migration
  const fs = await import('fs');
  const migrationSql = fs.readFileSync('../migrations/001_schema.sql', 'utf8');
  const seedSql = fs.readFileSync('../seed.sql', 'utf8');
  
  // 2. Check existing users
  try {
    const res = await fetch(`${BASE}/auth/v1/admin/users`, { headers });
    const data = await res.json();
    console.log('Existing users:', data?.users?.length ?? 0);
  } catch (e) {
    console.log('Cannot list users:', e.message);
  }

  // 3. Try Supabase Management API SQL endpoint
  try {
    const sqlRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT}/sql/query`, {
      method: 'POST',
      headers: { ...headers },
      body: JSON.stringify({ query: 'SELECT current_database() as db' })
    });
    const sqlData = await sqlRes.text();
    console.log('SQL API:', sqlData.substring(0, 200));
  } catch (e) {
    console.log('SQL API not available:', e.message);
  }

  // 4. Try creating users via auth admin API
  try {
    const users = [
      { email: 'customer@test.com', password: 'Password123!', email_confirm: true, user_metadata: { name: 'Test Customer' } },
      { email: 'admin@test.com', password: 'Password123!', email_confirm: true, user_metadata: { name: 'Admin User' } }
    ];
    for (const u of users) {
      const r = await fetch(`${BASE}/auth/v1/admin/users`, {
        method: 'POST', headers, body: JSON.stringify(u)
      });
      const d = await r.json();
      console.log(`Create ${u.email}:`, d.id ? `OK (${d.id.substring(0,8)}...)` : `FAIL - ${JSON.stringify(d)}`);
    }
  } catch (e) {
    console.log('Cannot create users:', e.message);
  }
}

setup().then(() => process.exit(0));
