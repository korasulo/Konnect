import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import styles from '../../../styles/ManageFeedback.module.css';


const ManageFeedback = () => {
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      const user = JSON.parse(userData);
      if (user.role !== 'manager') {
        router.push('/');
      } else {
        setUser(user);
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch('/api/feedback');
        if (!res.ok) {
          throw new Error('Failed to fetch feedback');
        }
        const data = await res.json();
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <div className={styles.container}>
        <Sidebar user={user} />
        <main className={styles.main}>
          <h1>Manage Feedback</h1>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((fb) => (
                <tr key={fb.client_id}>
                  <td>{fb.client_id}</td>
                  <td>{fb.rating}</td>
                  <td>{fb.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ManageFeedback;
