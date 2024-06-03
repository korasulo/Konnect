import pool from '../../../lib/db';



export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [packages] = await pool.query('SELECT * FROM packages');
      res.status(200).json(packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    const { userId, packageId } = req.body;

    if (!userId || !packageId) {
      return res.status(400).json({ message: 'User ID and package ID are required' });
    }

    try {
      const [[client]] = await pool.query('SELECT client_id FROM client WHERE user_id = ?', [userId]);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const [[pkg]] = await pool.query('SELECT * FROM packages WHERE package_id = ?', [packageId]);
      if (!pkg) {
        return res.status(404).json({ message: 'Package not found' });
      }

    
      const [[user]] = await pool.query('SELECT balance FROM client WHERE client_id = ?', [client.client_id]);
      if (user.balance >= pkg.price) {
       
        await pool.query('UPDATE client SET balance = balance - ?, min = min + ?, sms = sms + ?, internet = internet + ? WHERE client_id = ?', [
          pkg.price, pkg.min, pkg.sms, pkg.internet, client.client_id
        ]);

       
        await pool.query('INSERT INTO client_packages (client_id, package_id, activation_date) VALUES (?, ?, NOW())', [
          client.client_id, packageId
        ]);

       
        await pool.query('INSERT INTO bills (client_id, amount, issue_date, due_date, status, description) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), ?, ?)', [
          client.client_id, pkg.price, 'Paid', `Purchased package: ${pkg.packageName}`
        ]);

        return res.status(200).json({ success: true, message: 'Package purchased successfully' });
      } else {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
      }
    } catch (error) {
      console.error('Error processing purchase:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
