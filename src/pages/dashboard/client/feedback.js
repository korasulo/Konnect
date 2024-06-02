import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import styles from '../../../styles/Feedback.module.css';

const Feedback = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== 'client') {
      setMessage('Only clients can give feedback');
      return;
    }

    if (!user.client_id) {
      setMessage('Client ID not found');
      return;
    }

    setClientId(user.client_id);
  }, [router]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId) {
      setMessage('Client ID is not available');
      return;
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ client_id: clientId, rating, comment }),
      });

      if (res.ok) {
        setMessage('Thank you for your feedback!');
        setRating(0);
        setComment('');
      } else {
        const data = await res.json();
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('An error occurred while submitting your feedback');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>Feedback</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.feedbackContainer}>
            <h1>Give Your Feedback</h1>
            {message && <p className={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} className={styles.feedbackForm}>
              <label>
                Rating:
                <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                  <option value="0">Select Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
              <label>
                Comment:
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows="4"
                ></textarea>
              </label>
              <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Feedback;
