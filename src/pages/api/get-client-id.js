import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const [rows] = await pool.query('SELECT client_id FROM client WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      return res.status(200).json({ client_id: rows[0].client_id });
    } else {
      return res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
