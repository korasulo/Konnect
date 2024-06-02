import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/CustomerServiceDashboard.module.css';

const CustomerServiceDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar user={user} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Customer Service Dashboard</h1>
          <p>Welcome to the customer service dashboard, {user.name}.</p>
        </div>
        <div className={styles.mainContent}>
          {/* Add customer service specific content here */}
  
  
        
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceDashboard;
