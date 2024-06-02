import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, password } = req.body;
    console.log('Received Token:', token);
    console.log('Received Password:', password);

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    try {
      const [users] = await pool.query('SELECT * FROM user WHERE resetPasswordToken = ? AND resetPasswordExpires > NOW()', [token]);
      console.log('User Query Result:', users);

      if (users.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      const user = users[0];

      await pool.query('UPDATE user SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE user_id = ?', [password, user.user_id]);

      res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
