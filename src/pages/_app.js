import { useEffect } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Load Midtrans script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <title>StudySociety</title>
        <meta name="description" content="Your study partner" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 