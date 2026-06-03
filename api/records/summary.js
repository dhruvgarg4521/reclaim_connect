import { getServiceClient, setCors } from '../_supabase.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const supabase = getServiceClient();

  const { data: records, error } = await supabase
    .from('records')
    .select('type, recorded_at, streak_day')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const relapses = records.filter((r) => r.type === 'relapse');
  const checkins = records.filter((r) => r.type === 'checkin');
  const lastRelapse = relapses[0] ?? null;

  // Current streak = checkins after the most recent relapse (or all checkins if no relapse)
  const streakCutoff = lastRelapse ? new Date(lastRelapse.recorded_at) : null;
  const currentStreakCheckins = streakCutoff
    ? checkins.filter((c) => new Date(c.recorded_at) > streakCutoff)
    : checkins;

  return res.status(200).json({
    currentStreak: currentStreakCheckins.length,
    totalRelapses: relapses.length,
    totalCheckins: checkins.length,
    lastRelapseDate: lastRelapse?.recorded_at ?? null,
    lastCheckinDate: checkins[0]?.recorded_at ?? null,
  });
}
