import React, { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import Avatar from './Avatar';
import { useNavigate, useParams } from 'react-router-dom';
import BlogItem from './BlogItem';

const AboutAuthor = (props) => {
    const context = useContext(BlogContext);
    const { blogs, fetchAuthorBlogs } = context;
    const [user, setUser] = useState(null);
    const { username } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const host = 'http://localhost:5000';
    const [loading, setLoading] = useState(true);

    const fetchAnotherUser = async () => {
        try {
            const response = await fetch(`${host}/api/auth/getanotheruser/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });
            const json = await response.json();
            setUser(json);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            props.setprogress(10);

            if (!token || token === 'undefined' || token === 'null') {
                props.setprogress(40);
                navigate('/login');
                return;
            }

            props.setprogress(50);
            await fetchAnotherUser();
            props.setprogress(70);

            // Fetch author's blogs
            const blogs = await fetchAuthorBlogs(username);

            setLoading(false);
            props.setprogress(100);
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    if (!user || loading) {
        return (
            <div className="container my-5 text-center">
                <Spinner />
            </div>
        );
    }

    const formattedDate = new Date(user.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return (
        <>
            <div className="container" style={{ marginTop: '1rem' }}>
                <div className="d-flex mx-3 my-4 justify-content-center">
                    <div className="d-flex align-items-stretch">
                        <div
                            className="profile-image d-flex justify-content-center align-items-center"
                            style={{
                                width: '11.5rem',
                                height: '11.5rem',
                                backgroundColor: 'black',
                                borderRadius: '50%',
                            }}
                        >
                            <Avatar name={user.username} size={40} />
                        </div>
                    </div>
                    <div className="d-flex flex-column mb-3 align-items-stretch mx-4">
                        <h4 className="my-3">Author Details</h4>
                        <p><b>Author's Name:</b> {user.username}</p>
                        <p><b>Bio:</b> {user.bio}</p>
                        <p><b>Date Joined:</b> {formattedDate}</p>
                    </div>
                </div>
            </div>

            <hr />

            <div className="d-flex my-3 justify-content-center">
                <h2>Blogs by</h2>
                <h2 className="mx-2" style={{ fontWeight: 'normal' }}>
                    <i>{user.username}</i>
                </h2>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner />
                </div>
            ) : (
                <div className="container my-3">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
                        {Array.isArray(blogs) && [...blogs].reverse().map(blog => (
                            <div key={blog._id} className="col d-flex justify-content-center">
                                <BlogItem blog={blog} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default AboutAuthor;
