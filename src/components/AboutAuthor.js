import React, { useContext, useEffect, useState } from 'react'
import BlogContext from '../context/blogs/blogContext'
import Spinner from './Spinner';
import Avatar from './Avatar';
import { useNavigate, useParams } from 'react-router-dom';
import BlogItem from './BlogItem';

const AboutAuthor = () => {
    const context = useContext(BlogContext);
    const { blogs, fetchAuthorBlogs } = context
    const [user, setUser] = useState(null);
    const { username } = useParams();
    // eslint-disable-next-line no-unused-vars
    const [blog, setBlog] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const host = 'http://localhost:5000'
    const[loading,setLoading] = useState(true);

    const fetchAnotherUser = async () => {
        try {
            const response = await fetch(`${host}/api/auth/getanotheruser/${username}`, {
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            navigate('/login');
        }

        const found = blogs.find((b) => b.username === username);
        if (found) {
            setBlog(found);
        } else {
            // Fetch directly from server if not in context
            (async () => {
                const fetched = await fetchAuthorBlogs(username);
                if (fetched) setBlog(fetched);
            })();
        }
        
        fetchAnotherUser(username)
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogs, fetchAuthorBlogs, navigate, ]);


    if (!user) {
        return (
            <div className='container' >
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
            <div className='container'>
                <div className='d-flex mx-3 my-4 justify-content-center'>
                    <div className='d-flex align-items-stretch' >
                        <div className='profile-image d-flex justify-content-center align-items-center'
                            style={{ width: '11.5rem', height: '11.5rem', backgroundColor: 'black', borderRadius: '50%' }}>
                            <Avatar name={user.username} size={40} />
                        </div>
                    </div>
                    <div className='d-flex flex-column mb-3 align-items-stretch'>
                        <h4 className='mx-4 my-3'>Author Details</h4>
                        <ul>
                            <p><b>Author's Name: </b>{user.username}</p>
                            <p><b>Bio:           </b>{user.bio}</p>
                            <p> Date Joined {formattedDate}</p>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='d-flex my-3 justify-content-center'>
                <h2>Blogs by </h2><h2 className='mx-2' style={{ fontWeight: 'normal' }}><i>{user.username}</i> </h2>
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
                                    <BlogItem blog={blog}  /> 
                                </div>
                            ))
                        ) : (
                            <p>No blogs found.</p>
                        )}
                    </div>
                </div>  
            )}    
        </>
    )
}

export default AboutAuthor
