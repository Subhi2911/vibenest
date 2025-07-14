import React, { useContext, useEffect, useState } from 'react';
import BlogItem from './BlogItem';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';

export default function Blogs(props) {
    const { blogs, getBlogs } = useContext(BlogContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            props.setprogress(10);
            await new Promise(res => setTimeout(res, 300)); // simulate delay
            props.setprogress(50);
            await getBlogs();
            props.setprogress(80);
            setLoading(false);
            props.setprogress(100);
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ marginTop: '1rem' }}>
            <div className="container my-4 text-center">
                <h2>VibeNest - Blogs</h2>
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
        </div>
    );
}
