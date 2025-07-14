import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import Ratings from './Ratings';

export default function Read(props) {
    const { id } = useParams();
    const { blogs, getBlogById } = useContext(BlogContext);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ New loading state
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const host = 'http://localhost:5000';

    useEffect(() => {
        const fetchData = async () => {
            props.setprogress(10);

            if (!token || token === 'undefined' || token === 'null') {
                props.setprogress(100);
                navigate('/login');
                return;
            }

            props.setprogress(30);
            let found = blogs.find((b) => b._id === id);

            if (found) {
                setBlog(found);
                props.setprogress(100);
                setLoading(false);
            } else {
                try {
                    const fetched = await getBlogById(id);
                    props.setprogress(70);
                    if (fetched) {
                        setBlog(fetched);
                    }
                    props.setprogress(100);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching blog:', error);
                    props.setprogress(100);
                    setLoading(false);
                }
            }
        };

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogs, id, getBlogById, navigate]);

    if (loading || !blog) {
        return (
            <div className="d-flex justify-content-center my-5">
                <Spinner />
            </div>
        );
    }

    const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div style={{ marginTop: '1rem' }}>
            <div className="container my-2">
                <h2 className="d-flex justify-content-center my-3">{blog.title}</h2>
                <div className="d-flex flex-column align-items-end mb-3">
                    <small className="my-1">Category: {blog.category}</small>
                    <figcaption className="blockquote-footer my-2">
                        Published by <cite title="Author">{blog.author?.username}</cite>
                    </figcaption>
                    <small className="text-body-secondary">Last updated {formattedDate}</small>
                </div>

                <img src={blog.imageurl} alt="cover" style={{ width: '100%', height: 'auto' }} />

                <div className="my-4" dangerouslySetInnerHTML={{ __html: blog.content }} />

                <hr />

                <div className="d-flex justify-content-center">
                    <p className="mx-3 my-2">Rate The Blog</p>
                    <Ratings
                        blogId={blog._id}
                        initialRating={blog.averageRating}
                        onRate={(newRating) => {
                            fetch(`${host}/api/blogs/${blog._id}/rate`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'auth-token': token,
                                },
                                body: JSON.stringify({ rating: newRating }),
                            })
                                .then(res => res.json())
                                .then(data => console.log('Rating saved', data))
                                .catch(console.error);
                        }}
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <p>
                        Click to know more about the author{' '}
                        <Link style={{ fontStyle: 'italic' }} to={`/aboutauthor/${blog.author?.username}`}>
                            {blog.author?.username}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
