import { getServiceClient, setCors } from './_supabase.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getServiceClient();

  // GET /api/me?userId=xxx — fetch profile + active subscription
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data, error } = await supabase
      .from('profiles')
      .select('*, subscriptions(plan, status, price_paid, expires_at, started_at)')
      .eq('id', userId)
      .single();

    if (error) return res.status(404).json({ error: 'Profile not found' });
    return res.status(200).json(data);
  }

  // POST /api/me — upsert profile on sign-in
  if (req.method === 'POST') {
    const { id, full_name, email, avatar_url, onboarding_complete } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id required' });

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        { id, full_name, email, avatar_url, onboarding_complete: onboarding_complete ?? false },
        { onConflict: 'id' },
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
