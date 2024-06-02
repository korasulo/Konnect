import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/MyOffers.module.css';

const MyOffers = () => {
  const [packages, setPackages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handleOfferClick = (packageId) => {
    router.push({
      pathname: '/dashboard/client/offer-details',
      query: { id: packageId }
    });
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>My Offers</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h2>My Offers</h2>
            <button className={styles.closeButton} onClick={() => router.back()}>✖</button>
          </div>
          <div className={styles.content}>
            <div className={styles.offerList}>
              {packages.map((pkg) => (
                <div
                  key={pkg.package_id}
                  className={styles.offerItem}
                  onClick={() => handleOfferClick(pkg.package_id)}
                >
                  {pkg.packageName}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default MyOffers;
