import React, { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import Avatar from './Avatar';
import { useNavigate, useParams } from 'react-router-dom';
import BlogItem from './BlogItem';
import InfiniteScroll from 'react-infinite-scroll-component';

const AboutAuthor = (props) => {
    const context = useContext(BlogContext);
    const { fetchAuthorBlogs } = context;
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const { username } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const host = process.env.REACT_APP_BACKEND_URL;
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(false);

    // Pagination states
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [totalBlogs, setTotalBlogs] = useState(0);

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

    // Fetch blogs page by page
    const fetchBlogsPage = async (pageToFetch = 1) => {
        if (!username) return;

        setLoadingBlogs(true);
        try {
            const data = await fetchAuthorBlogs(username, pageToFetch, 6); // adjust limit as needed
            if (data) {
                if (pageToFetch === 1) {
                    setBlogs(data.blogs || []);
                } else {
                    setBlogs(prev => [...prev, ...(data.blogs || [])]);
                }
                setTotalBlogs(data.total || 0);

                if ((blogs.length + (data.blogs?.length || 0)) >= data.total) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                setPage(pageToFetch + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching author's blogs:", error);
            setHasMore(false);
        }
        setLoadingBlogs(false);
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

            await fetchBlogsPage(1);

            setLoadingUser(false);
            props.setprogress(100);
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    if (!user || loadingUser) {
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

            {loadingBlogs && blogs.length === 0 ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner />
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={blogs.length}
                    next={() => fetchBlogsPage(page)}
                    hasMore={hasMore}
                    loader={<div className="d-flex justify-content-center my-3"><Spinner /></div>}
                    endMessage={<p className="text-center mt-4"><b>You've reached the end!</b></p>}
                >
                    <div className="container my-3">
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
                            {Array.isArray(blogs) && blogs.length > 0 ? (
                                [...blogs].reverse().map(blog => (
                                    <div key={blog._id} className="col d-flex justify-content-center">
                                        <BlogItem blog={blog} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">No blogs found for this author.</p>
                            )}
                        </div>
                    </div>
                </InfiniteScroll>
            )}
        </>
    );
};

export default AboutAuthor;
