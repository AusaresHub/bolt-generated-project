import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BookDetails: React.FC = () => {
  const [book, setBook] = useState<any>(null);

  useEffect(() => {
    fetch('/book/details')
      .then(response => response.json())
      .then(data => setBook(data));
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
