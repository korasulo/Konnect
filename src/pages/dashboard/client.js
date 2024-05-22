import Head from 'next/head';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import userProfile from '../../../public/user-profile.png';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '../../components/Layout/Sidebar.js';
import styles from '../../styles/ClientDashboard.module.css';
// Client Dashboard Component
const ClientDashboard = () => {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>User Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.balanceSection}>
              <h3>Recharge</h3>
              <p>Your Balance is :</p>
              <p style={{ fontSize: '30px' }}>0 Lekë</p>
              <p>Last recharge 22 May</p>
              <button className={styles.button}>Top Up</button>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.cellularService}>
                <h3>Mobile Service</h3>
                <div className={styles.serviceDetails}>
                  <div>0 GB</div>
                  <div>0 Min</div>
                  <div>0 SMS</div>
                </div>
              </div>
              <div className={styles.lowerRight}>
                <div className={styles.flowerBoxSection}>
                  <h3>Flower Box</h3>
                  <button className={styles.button}>Shake it now</button>
                </div>
                <div className={styles.offerSection}>
                  <h3>My Offers</h3>
                  <button className={styles.offerButton}>View all</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ClientDashboard;