import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const [[client]] = await pool.query(
      'SELECT client_id FROM client WHERE user_id = ?',
      [userId]
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    const clientId = client.client_id;
    const [[lastShake]] = await pool.query(
      'SELECT shake_date FROM shake_log WHERE client_id = ? AND shake_date = ? ORDER BY shake_date DESC LIMIT 1',
      [clientId, today]
    );

    if (lastShake) {
      return res.status(400).json({ success: false, message: 'You have already shaken today' });
    } else {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error checking shake status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
