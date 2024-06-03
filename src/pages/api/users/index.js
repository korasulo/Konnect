import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { role } = req.query;
    if (role) {
      try {
        const [users] = await pool.query('SELECT * FROM user WHERE role = ?', [role]);
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      try {
        const [users] = await pool.query('SELECT * FROM user');
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  } else if (req.method === 'POST') {
    const { email, phonenumber, password, role, additionalInfo } = req.body;

    if (!phonenumber || !password) {
      return res.status(400).json({ message: 'Phone number and  password are required' });
    }

    try {
    
      const [existingUsers] = await pool.query('SELECT * FROM user WHERE email = ? OR phonenumber = ?', [email, phonenumber]);
      if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'User with this email or phone number already exists' });
      }

     
      await pool.query('INSERT INTO user (email, phonenumber, password, role) VALUES (?, ?, ?, ?)', [
        email,
        phonenumber,
        password,
        role
      ]);

     
      const [newUser] = await pool.query('SELECT * FROM user WHERE email = ? AND phonenumber = ?', [email, phonenumber]);

     
      switch (role) {
        case 'client':
          await pool.query('INSERT INTO client (user_id, balance, balanceCoins, min, sms, internet) VALUES (?, 0, 0, 0, 0, 0)', [
            newUser[0].user_id
          ]);
          break;
        case 'customer_service':
          await pool.query('INSERT INTO clientserviceagent (user_id, name, lastname, birthday) VALUES (?, ?, ?, ?)', [
            newUser[0].user_id, additionalInfo.name, additionalInfo.lastname, additionalInfo.birthday
          ]);
          break;
        case 'manager':
          await pool.query('INSERT INTO manager (user_id, name, lastname, birthday) VALUES (?, ?, ?, ?)', [
            newUser[0].user_id, additionalInfo.name, additionalInfo.lastname, additionalInfo.birthday
          ]);
          break;
      }

      res.status(201).json(newUser[0]);
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await pool.query('DELETE FROM client WHERE user_id = ?', [id]);
      await pool.query('DELETE FROM clientserviceagent WHERE user_id = ?', [id]);
      await pool.query('DELETE FROM manager WHERE user_id = ?', [id]);
      await pool.query('DELETE FROM user WHERE user_id = ?', [id]);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    const { id } = req.query;
    const { email, phonenumber, password, role, additionalInfo } = req.body;

    try {
      await pool.query('UPDATE user SET email = ?, phonenumber = ?, password = ?, role = ? WHERE user_id = ?', [email, phonenumber, password, role, id]);
      switch (role) {
        case 'manager':
          await pool.query('UPDATE manager SET name = ?, lastname = ?, birthday = ? WHERE user_id = ?', [additionalInfo.name, additionalInfo.lastname, additionalInfo.birthday, id]);
          break;
        case 'customer_service':
          await pool.query('UPDATE clientserviceagent SET name = ?, lastname = ?, birthday = ? WHERE user_id = ?', [additionalInfo.name, additionalInfo.lastname, additionalInfo.birthday, id]);
          break;
        case 'client':
          await pool.query('UPDATE client SET name = ?, lastname = ?, birthday = ?, birthplace = ?, gender = ?, personalNr = ?, balance = ?, balanceCoins = ?, min = ?, sms = ?, internet = ? WHERE user_id = ?', [additionalInfo.name, additionalInfo.lastname, additionalInfo.birthday, additionalInfo.birthplace, additionalInfo.gender, additionalInfo.personalNr, additionalInfo.balance, additionalInfo.balanceCoins, additionalInfo.min, additionalInfo.sms, additionalInfo.internet, id]);
          break;
      }
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
