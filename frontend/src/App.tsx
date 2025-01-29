import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import BookDetails from './components/BookDetails';
import Checkout from './components/Checkout';
import Success from './components/Success';
import Cancel from './components/Cancel';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user data if logged in
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/book/details" element={<BookDetails />} />
        <Route path="/checkout" element={<Checkout user={user} />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
      </Routes>
    </Router>
  );
};

export default App;
</boltArtifact>
  
  <boltArtifact id="book-release-app" title="Book Release Application">
  <boltAction type="file" filePath="frontend/src/components/Home.tsx">import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div>
      <h1>Welcome to the WorldCommunity</h1>
      <p>Join us in making the world a better place.</p>
      {user ? (
        <div>
          <p>Hello, {user.name}!</p>
          <Link to="/book/details">View Book Details</Link>
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
