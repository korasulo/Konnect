import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/RegisterPage.module.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, phone, password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className={styles.background}>
      <main className={styles.main}>
        <div className={styles.registerContainer}>
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <h1>Register</h1>
            {error && <p className={styles.error}>{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.registerInput}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.registerInput}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.registerInput}
              required
            />
            <button type="submit" className={styles.registerButton}>
              Submit and Register!
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
