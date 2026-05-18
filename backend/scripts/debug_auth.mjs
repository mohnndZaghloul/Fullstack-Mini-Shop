const PROJECT = 'moolaxsrduqwyabzhkub';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vb2xheHNyZHVxd3lhYnpoa3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwOTY1MTgsImV4cCI6MjA5NDY3MjUxOH0.aLppOPhud2KnSYYhTYW7noeR_7vExMePm2hsmSQzcHU';
const BASE = `https://${PROJECT}.supabase.co`;

async function test() {
  // 1. Login
  const loginRes = await fetch(`${BASE}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com', password: 'Password123!' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  if (!token) {
    console.log('Login failed:', JSON.stringify(loginData));
    process.exit(1);
  }
  console.log('Login OK, token obtained');

  // 2. Try profile query with auth header
  const profileRes = await fetch(
    `${BASE}/rest/v1/profiles?id=eq.0d4a9f15-a023-46c8-908c-774ff55122d8`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` } }
  );
  console.log('Profile response status:', profileRes.status);
  const profileText = await profileRes.text();
  console.log('Profile body:', profileText.substring(0, 500));
  
  // 3. Try a simpler query - what tables exist?
  const catsRes = await fetch(
    `${BASE}/rest/v1/categories?select=name`,
    { headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` } }
  );
  console.log('Categories status:', catsRes.status);
  const catsText = await catsRes.text();
  console.log('Categories:', catsText.substring(0, 500));
}

test().catch(e => console.log('Error:', e.message));
