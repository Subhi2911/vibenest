import React, { useContext, useEffect } from 'react'
import BlogContext from '../context/blogs/blogContext';

const Read = (props) => {
    const context = useContext(BlogContext); 
    const {fetchMyBlogs} = context;
    const{blog}=props;
    useEffect(() => {
            fetchMyBlogs(blog._id);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

    return (
        <>
            <div>
                <img src={`http://localhost:5000${blog.imageurl}`} alt="image-top" style={{ width: '100%', height: '20rem', objectFit: 'cover' }} />
            </div>
            
        </>
    )
    }

export default Read
