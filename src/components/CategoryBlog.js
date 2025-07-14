import React, { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import BlogItem from './BlogItem';

const CategoryBlog = (props) => {
    const context = useContext(BlogContext);
    const { blogs, fetchCatBlogs } = context;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            props.loaderColor(props.color); // Set spinner color immediately
            props.setprogress(10);
            await new Promise(res => setTimeout(res, 300)); // simulate delay
            props.setprogress(50);
            await fetchCatBlogs(props.category);
            props.setprogress(80);
            setLoading(false);
            props.setprogress(100);
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.category]); // only rerun when category changes

    return (
        <div style={{ marginTop: '1rem' }}>
            <div className='container my-4'>
                <div className='text-center'>
                    <h2>VibeNest - {props.category} Blog</h2>
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center my-5">
                        <Spinner />
                    </div>
                ) : (
                    <div className='container my-3'>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
                            {Array.isArray(blogs) && blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <div key={blog._id} className="col d-flex justify-content-center">
                                        <BlogItem blog={blog} />
                                    </div>
                                ))
                            ) : (
                                <div className='text-center'>
                                    <p>No blogs found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryBlog;
