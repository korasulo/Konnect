import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    try {
      const [bills] = await pool.query(
        'SELECT * FROM bills WHERE client_id = (SELECT client_id FROM client WHERE user_id = ?) ORDER BY issue_date DESC',
        [userId]
      );
      res.status(200).json(bills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
