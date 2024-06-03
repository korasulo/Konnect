import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [[pkg]] = await pool.query('SELECT * FROM packages WHERE package_id = ?', [id]);
      if (!pkg) {
        return res.status(404).json({ message: 'Package not found' });
      }
      res.status(200).json(pkg);
    } catch (error) {
      console.error('Error fetching package:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
