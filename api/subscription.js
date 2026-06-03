import { getServiceClient, setCors } from './_supabase.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getServiceClient();

  // GET /api/subscription?userId=xxx
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? null);
  }

  // POST /api/subscription — activate a plan after purchase
  if (req.method === 'POST') {
    const { user_id, plan, price_paid, expires_at } = req.body || {};
    if (!user_id || !plan) return res.status(400).json({ error: 'user_id and plan required' });

    // Cancel any existing active subscription first
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('user_id', user_id)
      .eq('status', 'active');

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id,
        plan,
        status: 'active',
        price_paid: price_paid ?? 0,
        expires_at: expires_at ?? null,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
