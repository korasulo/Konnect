import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/styles/LoginPage.module.css";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push("/");
    }
  }, [session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        emailOrPhone,
        password,
      });
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An error occurred while signing in");
    }
  };

  const handleRegisterClick = () => {
    router.push("/register");
  };

  return (
    <div className={styles.background}>
      <main className={styles.main}>
        <div className={styles.loginContainer}>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className={styles.logo}
            />
            <h1>Log in to your account</h1>
            <p className={styles.registerLink}>
              Are you not registered in Connect?{" "}
              <a onClick={handleRegisterClick}>
                <strong>Register now!</strong>
              </a>
            </p>
            {error && <p className={styles.error}>{error}</p>}
            <input
              type="text"
              placeholder="Email or phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className={styles.loginInput}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
              required
            />
            <a className={styles.forgotPasswordLink}>
              Have you forgotten your password?
            </a>
            <div className={styles.loginActions}>
              <button type="submit" className={styles.loginButton}>
                Submit
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => router.push("/")}
              >
                Cancel
              </button>
            </div>
            <p className={styles.terms}>
              By clicking <strong>Continue</strong> above, you are accepting that you have read, understood and accepted the {" "}
              <a href="#terms-and-conditions">Terms and Conditions</a> and
              <a href="#privacy-policy"> Privacy Policy</a> of Connect.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
