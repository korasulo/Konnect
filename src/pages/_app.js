// src/pages/_app.js
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Redirecting...</div>;
  }

  return children;
}

export default MyApp;
