import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import BlogContext from '../context/blogs/blogContext';

export default function BlogItem({ blog, updateBlog }) {
    const context = useContext(BlogContext);
    const { deleteBlog } = context;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const host = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');
    const location = useLocation();

    const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const handleClick = () => {
        if (token) {
            navigate(`/read/${blog._id}`);
        } else {
            navigate('/login');
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteBlog(blog._id);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        updateBlog(blog);
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
    }, [token, host]);

    const isOwner = user && blog.author && user.username === blog.author.username;

    return (
        <div>
            <div className="card" style={{ height: '35rem', overflow: 'hidden', cursor: 'pointer' }} onClick={handleClick}>
                <img
                    src={blog.imageurl}
                    className="card-img-top"
                    alt="blog"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />

                <div className="card-body d-flex flex-column" style={{ height: 'calc(100% - 200px)' }}>
                    <h5 className="card-title">{blog.title}</h5>
                    <figcaption className="blockquote-footer my-2" style={{ marginLeft: '2rem' }}>
                        Published by <cite>{blog.author?.username}</cite>
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
                    <div className="d-flex mt-auto" style={{ zIndex: '1' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                            className="btn btn-primary mx-2"
                        >
                            Read
                        </button>
                        {user && isOwner && location.pathname === '/myblogs' && (
                            <>
                                <div
                                    className="mx-5 my-1"
                                    onClick={handleEdit}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </div>

                                <div
                                    className="mx-3 my-1"
                                    onClick={handleDelete}
                                    style={{ cursor: 'pointer' }}
                                >
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
