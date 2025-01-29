import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  login: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/auth/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    };

    fetchUser();
  }, []);

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/src/App.tsx">import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import BookDetails from './components/BookDetails';
import Checkout from './components/Checkout';
import Success from './components/Success';
import Cancel from './components/Cancel';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/details" element={<BookDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/src/components/Home.tsx">import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <h1>Welcome to the WorldCommunity</h1>
      <p>Join us in making the world a better place.</p>
      {user ? (
        <div>
          <p>Hello, {user.name}!</p>
          <Link to="/book/details">View Book Details</Link>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/auth/google">Login with Google</Link>
          <Link to="/auth/facebook">Login with Facebook</Link>
          <Link to="/signup">Sign Up with Email</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/src/components/BookDetails.tsx">import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BookDetails: React.FC = () => {
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const response = await fetch('/book/details');
      const data = await response.json();
      setBook(data);
    };

    fetchBookDetails();
  }, []);

  return (
    <div>
      <h1>Book Details</h1>
      {book ? (
        <div>
          <h2>{book.title}</h2>
          <p>{book.description}</p>
          <p>Author: {book.author}</p>
          <p>Price: ${book.price}</p>
          <Link to="/checkout">Buy Now</Link>
        </div>
      ) : (
        <p>Loading book details...</p>
      )}
    </div>
  );
};

export default BookDetails;
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/src/components/Checkout.tsx">import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

const Checkout: React.FC = () => {
  const { user } = useAuth();
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
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/src/components/Success.tsx">import React from 'react';

const Success: React.FC = () => {
  return (
    <div>
      <h1>Thank you for your purchase!</h1>
      <p>You have successfully purchased "The Philosophy of Ma\'at and the Resurrection of Wosir". Welcome to the WorldCommunity!</p>
    </div>
  );
};

export default Success;
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/src/components/Cancel.tsx">import React from 'react';

const Cancel: React.FC = () => {
  return (
    <div>
      <h1>Payment Cancelled</h1>
      <p>Your payment was cancelled. If you have any questions, please contact us.</p>
    </div>
  );
};

export default Cancel;
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/.env">REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
FRONTEND_URL=http://localhost:3000
