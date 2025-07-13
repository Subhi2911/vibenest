import React, { useState } from 'react';

function Ratings({ blogId, initialRating, onRate }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(null);

  const handleClick = (rate) => {
    setRating(rate);
    if (onRate) onRate(rate);
  };

  return (
    <div>
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          style={{ cursor: 'pointer', color: (hover || rating) >= star ? '#ffc107' : '#e4e5e9', fontSize: '24px' }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          role="button"
          aria-label={`${star} Star`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default Ratings;
