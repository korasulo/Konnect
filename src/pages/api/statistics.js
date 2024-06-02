import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    console.log('Method not allowed');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const [clientsResult] = await pool.query('SELECT COUNT(*) AS count FROM user WHERE role = ?', ['client']);
    const [managersResult] = await pool.query('SELECT COUNT(*) AS count FROM user WHERE role = ?', ['manager']);
    const [customerServiceAgentsResult] = await pool.query('SELECT COUNT(*) AS count FROM user WHERE role = ?', ['customer_service']);

    const clientsCount = clientsResult[0]?.count;
    const managersCount = managersResult[0]?.count;
    const customerServiceAgentsCount = customerServiceAgentsResult[0]?.count;


    res.status(200).json({
      clients: clientsCount,
      managers: managersCount,
      customerServiceAgents: customerServiceAgentsCount,
    });
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

