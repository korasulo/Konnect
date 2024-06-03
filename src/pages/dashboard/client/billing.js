import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import Sidebar from "../../../../components/Sidebar";
import styles from "../../../styles/Billing.module.css";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestBill, setLatestBill] = useState(null);
  const billRef = useRef();

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          throw new Error("No user found in localStorage");
        }

        const response = await fetch(`/api/billing?userId=${user.user_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch billing data");
        }

        const data = await response.json();
        setBills(data);
        if (data.length > 0) {
          setLatestBill(data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching billing data:", error);
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const renderBars = () => {
    if (!bills.length) return null;
    return bills
      .slice(0, 12)
      .map((bill, index) => (
        <div
          key={index}
          className={styles.bar}
          style={{ height: `${(bill.amount / 2000) * 100}%` }}
        ></div>
      ));
  };

  const handleExportPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = billRef.current;
    html2pdf().from(element).save("latest-bill.pdf");
  };

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <div className={styles.container}>
        <Head>
          <title>Billing</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.header}>
            <h1>My bills</h1>
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
              {loading ? <p>Loading...</p> : renderBars()}
            </div>
          </div>
          <div className={styles.latestBill}>
            <h2>Last Bill</h2>
            {latestBill ? (
              <div className={styles.billDetails} ref={billRef}>
                <div className={styles.billHeader}>
                  <span>{new Date(latestBill.issue_date).getFullYear()}</span>
                  <span>
                    {new Date(latestBill.issue_date).toLocaleString("default", {
                      month: "short",
                    })}
                  </span>
                </div>
                <div className={styles.billAmount}>
                  <h3>{latestBill.amount} Lek</h3>
                  <span className={styles.paid}>{latestBill.status}</span>
                </div>
                <div className={styles.billDescription}>
                  <p>{latestBill.description}</p>
                </div>
              </div>
            ) : (
              <p>No latest bill available</p>
            )}
          </div>
          <button onClick={handleExportPDF}>Export as PDF</button>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Billing;


