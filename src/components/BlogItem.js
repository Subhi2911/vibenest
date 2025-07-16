import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import BlogContext from '../context/blogs/blogContext';

export default function BlogItem({ blog, updateBlog }) {

    const context = useContext(BlogContext)
    const { deleteBlog } = context
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const host = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');

    const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const location = useLocation();

    const handleClick = () => {
        if (token) {
            navigate(`/read/${blog._id}`);
        } else {
            navigate('/login');
        }
    };

    const handleDelete = () => {
        deleteBlog(blog._id);
        //props.showAlert("Note deleted successfully!", "success");
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${host}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });
                const json = await response.json();
                setUser(json);

            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (token) {
            fetchUser();

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const isOwner = user?.username === blog.author?.username;

    return (
        <div>
            <div className="card" style={{ height: '35rem', overflow: 'hidden' }} onClick={handleClick}>
                <img
                    src={blog.imageurl}
                    className="card-img-top"
                    alt="blog"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />

                <div className="card-body d-flex flex-column" style={{ height: 'calc(100% - 200px)' }}>
                    <h5 className="card-title">{blog.title}</h5>
                    <figcaption className="blockquote-footer my-2" style={{ marginLeft: '2rem' }}>
                        Published by <cite title="Source Title">{blog.author?.username}</cite>
                    </figcaption>
                    <p className="card-text">
                        {DOMPurify.sanitize(blog.content.replace(/<[^>]+>/g, '')).slice(0, 100)}...
                    </p>
                    <p className="card-text">
                        <small className="text-body-secondary">Last updated {formattedDate}</small>
                    </p>
                    <div>
                        <p>Average Rating: ⭐{blog?.averageRating?.toFixed(1)}/5</p>
                    </div>
                    <div className="d-flex mt-auto" style={{zIndex:'1'}}>
                        <button onClick={handleClick} className="btn btn-primary mx-2">Read</button>
                        {isOwner && location.pathname === '/myblogs' && (
                            <>
                                <div
                                    className="mx-5 my-1"
                                    onClick={() => {
                                        updateBlog(blog);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </div>

                                <div className="mx-3 my-1" style={{ cursor: 'pointer' }} onClick={handleDelete}>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
