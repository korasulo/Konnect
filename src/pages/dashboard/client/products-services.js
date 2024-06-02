import React from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '../../components/Layout/Sidebar';
import styles from '../../styles/ProductsServices.module.css';

// /styles/ProductsServices.module.css';

const ProductsServices = () => {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>Products & Services</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h2>My number</h2>
            <button className={styles.closeButton}>✖</button>
          </div>
          <div className={styles.balance}>
            <p>Balance</p>
            <h3>0.00 Lekë <span>Remaining balance</span></h3>
            <button className={styles.topUpButton}>Rimbush</button>
            <p className={styles.refresh}>Refresh ↻</p>
          </div>
          <div className={styles.tabs}>
            <div className={styles.tab}>My plan</div>
            <div className={styles.tab}>Activity</div>
            <div className={styles.tab}>Extra package</div>
          </div>
          <div className={styles.content}>
            <h3>Active services</h3>
            <p>Main services</p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProductsServices;
