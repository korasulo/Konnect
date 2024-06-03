import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/TopUp.module.css';

const TopUp = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('choose-value');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (event) => {
    setSelectedAmount(null);
    setCustomAmount(event.target.value);
  };

  const handleAddCardClick = () => {
    setShowAddCard(true);
  };

  const handleBackClick = () => {
    setShowAddCard(false);
  };

  const handleCloseClick = () => {
    router.back();
  };

  const handleTopUp = async () => {
    const amount = selectedAmount || customAmount;
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please select or enter a valid amount');
      return;
    }

    try {
      const res = await fetch('/api/update-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id, amount, cardDetails: {} }), // Assuming card details are collected elsewhere
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchClientDetails(); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      alert('An error occurred while updating balance');
    }
  };

  const fetchClientDetails = async () => {
    try {
      const res = await fetch(`/api/clients/${user.user_id}`);
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>Top Up</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          {showAddCard ? (
            <div className={styles.addCardForm}>
              <button className={styles.backButton} onClick={handleBackClick}>←</button>
              <h2>Enter Card Details</h2>
              <input type="text" placeholder="Card Number" className={styles.input} />
              <div className={styles.cardDetails}>
                <input type="text" placeholder="Expiry Date" className={styles.input} />
                <input type="text" placeholder="CVV" className={styles.input} />
              </div>
              <div className={styles.saveCard}>
                <input type="checkbox" id="saveCard" />
                <label htmlFor="saveCard">Save Card</label>
              </div>
              <input type="text" placeholder="Name on Card" className={styles.input} />
              <button className={styles.continueButton}>Continue</button>
            </div>
          ) : (
            <>
              <div className={styles.header}>
                <h2>Top Up</h2>
                <button className={styles.closeButton} onClick={handleCloseClick}>✖</button>
              </div>
              <div className={styles.tabContainer}>
                <button
                  className={`${styles.tabButton} ${selectedTab === 'choose-value' ? styles.active : ''}`}
                  onClick={() => setSelectedTab('choose-value')}
                >
                  Choose Value
                </button>
                <button
                  className={`${styles.tabButton} ${selectedTab === 'enter-value' ? styles.active : ''}`}
                  onClick={() => setSelectedTab('enter-value')}
                >
                  Enter Value
                </button>
              </div>
              {selectedTab === 'choose-value' && (
                <div className={styles.amountSelection}>
                  <p>Choose Amount</p>
                  <div className={styles.amounts}>
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000].map((amount, index) => (
                      <button
                        key={index}
                        className={`${styles.amountButton} ${selectedAmount === amount ? styles.selected : ''}`}
                        onClick={() => handleAmountClick(amount)}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedTab === 'enter-value' && (
                <div className={styles.customAmount}>
                  <p>Enter Amount</p>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className={styles.input}
                    placeholder="Enter amount..."
                  />
                </div>
              )}
              <div className={styles.paymentMethod}>
                <p>Payment Method</p>
                <input type="text" className={styles.paymentInput} placeholder="Add Card" onClick={handleAddCardClick} />
              </div>
              <button className={styles.topUpButton} onClick={handleTopUp}>Top Up Now</button>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default TopUp;
