
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/Dashboard.module.css';
import Head from 'next/head';
import ProtectedRoute from '../../../../components/ProtectedRoute';


const ManagerDashboard = () => {
  const router = useRouter();
  const [statistics, setStatistics] = useState({ clients: 0, managers: 0, customerServiceAgents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await fetch('/api/statistics');
        const data = await res.json();
        setStatistics(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <div className={styles.container}>
        <Head>
          <title>Manager Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <h1>Manager Dashboard</h1>
          <p>Welcome to the manager dashboard.</p>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.statistics}>
              <div className={styles.statCard}>
                <h3>Total Clients</h3>
                <p>{statistics.clients}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Active Managers</h3>
                <p>{statistics.managers}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Customer Service Agents</h3>
                <p>{statistics.customerServiceAgents}</p>
              </div>
            </div>
          )}

        
          <div className={styles.quickLinks}>
            <h2>Quick Links</h2>
            <ul>
              <li onClick={() => navigateTo('/dashboard/reports')}>View Reports</li>
              <li onClick={() => navigateTo('/dashboard/settings')}>Settings</li>
              <li onClick={() => navigateTo('/dashboard/support')}>Support</li>
            </ul>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ManagerDashboard;