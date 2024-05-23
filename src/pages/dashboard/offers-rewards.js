import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/OffersRewards.module.css';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Layout/Sidebar.js';

const OffersRewards = () => {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>Offers and Rewards</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>Flower Box</h1>
          </div>
          <div className={styles.content}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Flower and Internet for you</h2>
                <p>Do you want to buy a flower box for</p>
                <p className={styles.price}>100 Lekë</p>
              </div>
              <button className={styles.activateButton}>Activate</button>
            </div>
            <div className={styles.collectionBanner}>
              <p>Check the collection of your flowers</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default OffersRewards;
