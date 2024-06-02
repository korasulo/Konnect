import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phonenumber, password, name } = req.body;

  if (!phonenumber || !password || !name) {
    return res.status(400).json({ message: 'Phone number, password, and name are required' });
  }

  try {
    const [existingUsers] = await pool.query('SELECT * FROM user WHERE phonenumber = ? OR email = ?', [
      phonenumber,
      email
    ]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'A user with the same phone number or email already exists' });
    }

    await pool.query('START TRANSACTION');

    const [result] = await pool.query('INSERT INTO user (email, phonenumber, password, role) VALUES (?, ?, ?, ?)', [
      email,
      phonenumber,
      password,
      'client', 
    ]);

    const userId = result.insertId;

    await pool.query('INSERT INTO client (user_id, name) VALUES (?, ?)', [
      userId,
      name,
    ]);

    await pool.query('COMMIT');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
