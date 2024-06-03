import React, { useState } from 'react';
import Head from 'next/head';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/Shake.module.css';

const Shake = () => {
  const [shaking, setShaking] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [vcoins, setVcoins] = useState(null);
  const [error, setError] = useState('');

  const handleShakeClick = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('/api/check-shake-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        const randomVCoins = Math.floor(Math.random() * 51);
        setVcoins(randomVCoins);
        setShowGift(true);
      }, 3000);

    } catch (error) {
      setError('An error occurred while checking shake status');
    }
  };

  const handleActivateClick = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('/api/activate-coins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id, vcoins }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while activating VCoins');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>Shake</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          {!showGift ? (
            <div className={styles.shakeSection}>
              <div className={`${styles.shakeAnimation} ${shaking ? styles.shaking : ''}`}></div>
              <button className={styles.shakeButton} onClick={handleShakeClick}>
                Shake
              </button>
              {error && <p className={styles.error}>{error}</p>}
            </div>
          ) : (
            <div className={styles.giftSection}>
              <h2>{vcoins} VCoins</h2>
              <p>Receive {vcoins} VCoins, valid for 2 months</p>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.activateButton} onClick={handleActivateClick}>Activate</button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Shake;
