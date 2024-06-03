import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, amount, cardDetails } = req.body;

    if (!userId || !amount || !cardDetails) {
      return res.status(400).json({ message: 'User ID, amount, and card details are required' });
    }

    try {
    
      const [[client]] = await pool.query('SELECT client_id FROM client WHERE user_id = ?', [userId]);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      await pool.query('UPDATE client SET balance = balance + ?, last_recharge_date = NOW() WHERE client_id = ?', [amount, client.client_id]);

      res.status(200).json({ success: true, message: 'Top up successful' });
    } catch (error) {
      console.error('Error processing top up:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
