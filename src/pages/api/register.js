import { pool } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phone, password } = req.body;

  if (!email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [existingUser] = await pool.query('SELECT * FROM user WHERE email = ? OR phonenumber = ?', [email, phone]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await pool.query('INSERT INTO user (email, phonenumber, password, role) VALUES (?, ?, ?, ?)', [
      email,
      phone,
      password,
      'client',
    ]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
