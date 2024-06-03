import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, vcoins } = req.body;

  if (!userId || vcoins === undefined) {
    return res.status(400).json({ message: 'User ID and VCoins are required' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const today = new Date().toISOString().split('T')[0];

      const [[client]] = await connection.query(
        'SELECT client_id, balanceCoins FROM client WHERE user_id = ?',
        [userId]
      );

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const clientId = client.client_id;

      const [[lastShake]] = await connection.query(
        'SELECT shake_date FROM shake_log WHERE client_id = ? AND shake_date = ? ORDER BY shake_date DESC LIMIT 1',
        [clientId, today]
      );

      if (lastShake) {
        return res.status(400).json({ success: false, message: 'You have already shaken today' });
      }

      await connection.query(
        'UPDATE client SET balanceCoins = balanceCoins + ? WHERE client_id = ?',
        [vcoins, clientId]
      );

      await connection.query(
        'INSERT INTO shake_log (client_id, shake_date) VALUES (?, NOW())',
        [clientId]
      );

      res.status(200).json({ success: true, message: 'VCoins activated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error activating VCoins:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

