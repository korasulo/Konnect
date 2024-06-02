import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar';
import styles from '../../../styles/ClientDashboard.module.css';
import Head from 'next/head';
import ProtectedRoute from '../../../../components/ProtectedRoute';

const ClientDashboard = () => {
  const [clientDetails, setClientDetails] = useState({
    balance: null,
    min: null,
    sms: null,
    internet: null,
    last_recharge_date: null,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  useEffect(() => {
    fetchClientDetails();
  }, []);

  const handleTopUpClick = () => {
    router.push('/dashboard/client/top-up');
  };

  const handleShakeClick = () => {
    router.push('/dashboard/client/shake');
  };

  const handleSeeAllOffersClick = () => {
    router.push('/dashboard/client/my-offers');
  };

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
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <p>Your Balance is:</p>
                  <p style={{ fontSize: '30px' }}>{clientDetails.balance} Lek</p>
                  <p>Last Recharge: {clientDetails.last_recharge_date}</p>
                  <button className={styles.button} onClick={handleTopUpClick}>Top Up</button>
                </>
              )}
            </div>
            <div className={styles.rightSection}>
              <div className={styles.cellularService}>
                <h3>Mobile service</h3>
                <div className={styles.serviceDetails}>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <>
                      <div>{clientDetails.internet} GB</div>
                      <div>{clientDetails.min} Min</div>
                      <div>{clientDetails.sms} SMS</div>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.lowerRight}>
                <div className={styles.flowerBoxSection}>
                  <h3>Flower Box</h3>
                  <button className={styles.button} onClick={handleShakeClick}>Shake now</button>
                </div>
                <div className={styles.offerSection}>
                  <h3>My Offers</h3>
                  <button className={styles.offerButton} onClick={handleSeeAllOffersClick}>See all</button>
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
