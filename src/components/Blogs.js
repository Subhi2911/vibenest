import React, { useContext, useEffect } from 'react'
import BlogItem from './BlogItem'
import BlogContext from '../context/blogs/blogContext'

export default function Blogs() {
    const context = useContext(BlogContext);
    const { blogs, getBlogs } = context;
    useEffect(() => {
        getBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div style={{ display: 'flex-wrap', }}>
                <div className='container my-3'>
                    <div className="container my-3 d-flex flex-wrap justify-content-start gap-4">
                        {Array.isArray(blogs) && blogs.map((blog) => (
                            <BlogItem
                                key={blog._id}
                                blog={blog}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
