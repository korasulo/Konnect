import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { client_id, rating, comment } = req.body;

    if (!client_id || !rating || !comment) {
      return res.status(400).json({ message: 'Client ID, rating, and comment are required' });
    }

    try {
      await pool.query('INSERT INTO feedback (client_id, rating, comment) VALUES (?, ?, ?)', [
        client_id,
        rating,
        comment,
      ]);
      res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const [feedbackRows] = await pool.query('SELECT * FROM feedback');
      res.status(200).json(feedbackRows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
