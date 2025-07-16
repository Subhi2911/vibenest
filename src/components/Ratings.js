import React, { useEffect, useState, useContext } from 'react';
import BlogContext from '../context/blogs/blogContext';

function Ratings({ blogId }) {
    const { fetchRatings, submitRating } = useContext(BlogContext);
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadRatings() {
            try {
                setError(null);
                const data = await fetchRatings(blogId);
                setRating(data.userRating || 0);
                setAverageRating(data.averageRating || 0);
            } catch (err) {
                setError("Failed to load ratings");
            }
        }
        loadRatings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogId]);

    const handleClick = async (rate) => {
        setLoading(true);
        try {
            const result = await submitRating(blogId, rate);
            if (result.success) {
                setRating(rate);
                if (result.averageRating !== undefined) {
                    setAverageRating(result.averageRating);
                }
            } else {
                setError("Failed to submit rating");
            }
        } catch {
            setError("Failed to submit rating");
        }
        setLoading(false);
    };

    const renderStars = (value) => {
        const stars = [];
        const fullStars = Math.floor(value);
        const halfStar = value - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for (let i = 1; i <= fullStars; i++) {
            stars.push(
                <span
                    key={`full-${i}`}
                    style={{ color: '#ffc107', fontSize: '20px', verticalAlign: 'middle', lineHeight: '20px' }}
                >
                    ★
                </span>
            );
        }
        if (halfStar) {
            stars.push(
                <span
                    key="half"
                    style={{
                        position: 'relative',
                        display: 'inline-block',
                        fontSize: '20px',
                        width: '20px',
                        verticalAlign: 'middle',
                        lineHeight: '20px',
                        overflow: 'hidden',
                    }}
                >
                    <span
                        style={{
                            position: 'absolute',
                            width: '50%',
                            overflow: 'hidden',
                            left: 0,
                            top: 0,
                            color: '#ffc107',
                            height: '100%',
                            lineHeight: '20px',
                        }}
                    >
                        ★
                    </span>
                    <span style={{ color: '#e4e5e9', lineHeight: '20px' }}>★</span>
                </span>
            );
        }
        for (let i = 1; i <= emptyStars; i++) {
            stars.push(
                <span
                    key={`empty-${i}`}
                    style={{ color: '#e4e5e9', fontSize: '20px', verticalAlign: 'middle', lineHeight: '20px' }}
                >
                    ★
                </span>
            );
        }
        return stars;
    };


    return (
        <div style={{ maxWidth: '400px', fontFamily: 'Arial, sans-serif' }}>
            {/* Rate the blog */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '140px', fontWeight: '600', fontSize: '16px' }}>
                    Rate the blog
                </div>
                <div>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            style={{
                                cursor: loading ? 'not-allowed' : 'pointer',
                                color: (hover || rating) >= star ? '#ffc107' : '#e4e5e9',
                                fontSize: '24px',
                                pointerEvents: loading ? 'none' : 'auto',
                                transition: 'color 0.2s ease',
                            }}
                            onClick={() => !loading && handleClick(star)}
                            onMouseEnter={() => !loading && setHover(star)}
                            onMouseLeave={() => !loading && setHover(null)}
                            role="button"
                            tabIndex={0}
                            aria-label={`${star} Star`}
                            onKeyDown={(e) => {
                                if (!loading && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    handleClick(star);
                                }
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>

            {/* Average rating */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '140px', fontWeight: '600', fontSize: '16px' }}>
                    Average rating
                </div>
                <div>
                    {renderStars(averageRating)}
                </div>
            </div>

            {error && <div style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>{error}</div>}
        </div>
    );
}

export default Ratings;
