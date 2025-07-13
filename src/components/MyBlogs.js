import React, { useContext, useEffect, useState } from 'react';
import BlogItem from './BlogItem';
import BlogContext from '../context/blogs/blogContext';

const MyBlogs = () => {
  const context = useContext(BlogContext);
  const { blogs, fetchAuthorBlogs } = context;

  const [username, setUsername] = useState(null);

  // Optional: you can open a modal here like you did in Blogs.js
  const updateBlog = (blog) => {
    // You can trigger a modal or navigate to edit page
    console.log("Update blog called", blog);
  };

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    if (!userToken) return;

    const fetchUsername = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/getuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        });

        const json = await response.json();

        if (json?.username) {
          setUsername(json.username);
          fetchAuthorBlogs(json.username);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUsername();
  }, [fetchAuthorBlogs]);

  return (
    <div style={{ display: 'flex-wrap' }}>
      <div className='container my-3'>
        <div className="container my-3 d-flex flex-wrap justify-content-start gap-4">
          {Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogItem key={blog._id} blog={blog} updateBlog={updateBlog} />
            ))
          ) : (
            <p>No blogs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;

