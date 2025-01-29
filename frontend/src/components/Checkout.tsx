import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

const Checkout: React.FC<{ user: any }> = ({ user }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const createCheckoutSession = async () => {
      const response = await fetch('/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await response.json();
      setSessionId(data.id);
    };

    if (user) {
      createCheckoutSession();
    }
  }, [user]);

  const redirectToCheckout = async () => {
    if (sessionId) {
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      console.error(error.message);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={redirectToCheckout} disabled={!sessionId}>
        Buy Now
      </button>
    </div>
  );
};

export default Checkout;
