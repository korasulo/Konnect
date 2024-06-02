// src/pages/dashboard/billing.js
import Head from 'next/head';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '../../components/Layout/Sidebar';
import styles from '../../styles/Billing.module.css';

const Billing = () => {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className={styles.container}>
        <Head>
          <title>Billing</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>My Bills</h1>
          </div>
          <div className={styles.chart}>
            <div className={styles.chartHeader}>
              <span>2023</span>
            </div>
            <div className={styles.months}>
              <div>Jan</div>
              <div>Feb</div>
              <div>Mar</div>
              <div>Apr</div>
              <div>May</div>
              <div>Jun</div>
              <div>Jul</div>
              <div>Aug</div>
              <div>Sep</div>
              <div>Oct</div>
              <div>Nov</div>
              <div>Dec</div>
            </div>
            <div className={styles.bars}>
              <div className={styles.bar} style={{ height: '20%' }}></div>
              <div className={styles.bar} style={{ height: '40%' }}></div>
              <div className={styles.bar} style={{ height: '60%' }}></div>
              <div className={styles.bar} style={{ height: '30%' }}></div>
              <div className={styles.bar} style={{ height: '10%' }}></div>
              <div className={styles.bar} style={{ height: '50%' }}></div>
              <div className={styles.bar} style={{ height: '70%' }}></div>
              <div className={styles.bar} style={{ height: '90%' }}></div>
              <div className={styles.bar} style={{ height: '60%' }}></div>
              <div className={styles.bar} style={{ height: '30%' }}></div>
              <div className={styles.bar} style={{ height: '80%' }}></div>
              <div className={styles.bar} style={{ height: '40%' }}></div>
            </div>
          </div>
          <div className={styles.latestBill}>
            <h2>Last Bill</h2>
            <div className={styles.billDetails}>
              <div className={styles.billHeader}>
                <span>2022</span>
                <span>Nov</span>
              </div>
              <div className={styles.billAmount}>
                <h3>1,800.40 Lekë</h3>
                <span className={styles.paid}>Paid</span>
              </div>
              <div className={styles.billDescription}>
              <p>Additional expenses</p>
              <p>Discount on the monthly payment: -333.00 Lekë</p>
              <p>Your services</p>

              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Billing;
