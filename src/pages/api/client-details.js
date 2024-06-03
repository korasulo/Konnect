import pool from '../../lib/db';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const [[client]] = await pool.query(
      'SELECT balance, min, sms, internet FROM client WHERE user_id = ?',
      [userId]
    );

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const [packages] = await pool.query(
      `SELECT p.packageName, p.min, p.sms, p.internet, cp.activation_date
       FROM client_packages cp
       JOIN packages p ON cp.package_id = p.package_id
       WHERE cp.client_id = (SELECT client_id FROM client WHERE user_id = ?)`,
      [userId]
    );

    res.status(200).json({ ...client, packages });
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
