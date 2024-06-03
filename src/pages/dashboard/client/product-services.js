import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/ProductsServices.module.css';
import { useRouter } from 'next/router';

const ProductsServices = () => {
  const [clientDetails, setClientDetails] = useState({
    balance: null,
    min: null,
    sms: null,
    internet: null,
    packages: [], // Initialize packages as an empty array
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          throw new Error('No user found in localStorage');
        }

        const response = await fetch(`/api/client-details?userId=${user.user_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch client details');
        }
        const data = await response.json();
        setClientDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client details:', error);
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, []);

  const handleTopUpClick = () => {
    router.push('/dashboard/client/top-up');
  };

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
            <h2>My Number</h2>
            <button className={styles.closeButton} onClick={() => router.back()}>✖</button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className={styles.balance}>
                <p>Balance</p>
                <h3>{clientDetails.balance} Lekë <span>remaining credit</span></h3>
                <button className={styles.topUpButton} onClick={handleTopUpClick}>Top Up</button>
              </div>
              <div className={styles.cellularService}>
                <h3>Mobile Service</h3>
                <div className={styles.serviceDetails}>
                  <div>{clientDetails.internet} GB</div>
                  <div>{clientDetails.min} Min</div>
                  <div>{clientDetails.sms} SMS</div>
                </div>
              </div>
              <div className={styles.purchasedPackages}>
                <h3>Purchased Packages</h3>
                <ul className={styles.packageList}>
                  {clientDetails.packages.map((pkg, index) => (
                    <li key={index} className={styles.packageItem}>
                      <p><strong>Package Name:</strong> {pkg.packageName}</p>
                      <p><strong>Minutes:</strong> {pkg.min}</p>
                      <p><strong>SMS:</strong> {pkg.sms}</p>
                      <p><strong>Internet:</strong> {pkg.internet} GB</p>
                      <p><strong>Activation Date:</strong> {new Date(pkg.activation_date).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProductsServices;
