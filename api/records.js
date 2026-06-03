import { getServiceClient, setCors } from './_supabase.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getServiceClient();

  // POST /api/records — log a checkin, relapse, or milestone
  if (req.method === 'POST') {
    const { user_id, type, note, streak_day } = req.body || {};
    if (!user_id || !type) return res.status(400).json({ error: 'user_id and type required' });

    const validTypes = ['checkin', 'relapse', 'milestone'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${validTypes.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('records')
      .insert({
        user_id,
        type,
        note: note?.trim() || null,
        streak_day: streak_day ?? 0,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // GET /api/records?userId=xxx — list recent records
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(200);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
