import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/OfferDetails.module.css';

const OfferDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  const router = useRouter();
  const { id: packageId } = router.query;

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await fetch(`/api/packages/${packageId}`);
        const data = await res.json();
        setPackageDetails(data);
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

  const handleBuyClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePaymentOptionClick = async (option) => {
    if (option === 'balance') {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await fetch('/api/packages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.user_id, packageId }),
        });
        const data = await res.json();
        if (data.success) {
          alert('Package purchased successfully!');
          setShowModal(false);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        alert('An error occurred while processing your payment.');
      }
    } else if (option === 'creditCard') {
      alert('Credit card payment option selected. Implement credit card processing.');
      setShowModal(false);
    }
  };

  if (!packageDetails) {
    return <p>Loading package details...</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>Offer Details</title>
          <link rel="icon" href="/offer_bg.jpg" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <button onClick={() => router.back()} className={styles.backButton}>
              ←
            </button>
            <h2>{packageDetails.packageName}</h2>
          </div>
          <div className={styles.content}>
            <div className={styles.offerDetails}>
              <h3>{packageDetails.packageName}</h3>
              <p>{packageDetails.price} Lekë</p>
              <table className={styles.detailsTable}>
                <tbody>
                  <tr>
                    <td>National Minutes</td>
                    <td>{packageDetails.min} National Minutes</td>
                  </tr>
                  <tr>
                    <td>Internet (MB)</td>
                    <td>{packageDetails.internet} Internet (MB)</td>
                  </tr>
                  <tr>
                    <td>National SMS</td>
                    <td>{packageDetails.sms} National SMS</td>
                  </tr>
                  <tr>
                    <td>Validity</td>
                    <td>{packageDetails.validity}</td>
                  </tr>
                </tbody>
              </table>
              <button className={styles.buyButton} onClick={handleBuyClick}>
                Buy
              </button>
            </div>
          </div>
          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <button className={styles.closeButton} onClick={handleCloseModal}>✖</button>
                <h2>Payment</h2>
                <p>Payment options</p>
                <div className={styles.paymentOptions}>
                  <div className={styles.paymentOption} onClick={() => handlePaymentOptionClick('balance')}>
                    <img src="/balance-icon.png" alt="Balance" />
                    <p>Balance</p>
                  </div>
                  <div className={styles.paymentOption} onClick={() => handlePaymentOptionClick('creditCard')}>
                    <img src="/credit-card.png" alt="Credit Card" />
                    <p>Credit Card</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default OfferDetails;
