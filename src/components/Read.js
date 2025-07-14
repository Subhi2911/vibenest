import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import Ratings from './Ratings';

export default function Read(props) {
    const { id } = useParams();
    const { blogs, getBlogById } = useContext(BlogContext);
    const [blog, setBlog] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const host = 'http://localhost:5000'

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            navigate('/login');
        }

        const found = blogs.find((b) => b._id === id);
        if (found) {
            setBlog(found);
        } else {
            // Fetch directly from server if not in context
            (async () => {
                const fetched = await getBlogById(id);
                if (fetched) setBlog(fetched);
            })();
        }
    }, [blogs, id, getBlogById, navigate]);


    if (!blog)
        return <div className="d-flex justify-content-center my-5">
            <Spinner />
        </div>
    const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const handleClick=()=>{
        if (token) {
            navigate(`/read/${blog.author?.username}`);
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="container my-3">
            <h2 className='d-flex justify-content-center my-3'>{blog.title}</h2>
            <div className='d-flex flex-column align-items-end mb-3'>
                <figcaption className="blockquote-footer my-2" style={{ marginLeft: '2rem' }}>
                    Published by <cite title="Source Title">{blog.author?.username}</cite>
                </figcaption>
                <small className="text-body-secondary">Last updated {formattedDate}</small>
            </div>
            <img src={blog.imageurl} alt="cover" style={{ width: '100%', height: 'auto' }} />


            <div className="my-4" dangerouslySetInnerHTML={{ __html: blog.content }} />
            <hr />
            <div className='d-flex justify-content-center' >
                <p className='mx-3 my-2'>Rate The Blog </p>
                <div >
                    <Ratings
                        blogId={blog._id}
                        initialRating={blog.averageRating}
                        onRate={(newRating) => {
                            // Send newRating to your backend API to save
                            fetch(`${host}/api/blogs/${blog._id}/rate`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', 'auth-token': token },
                                body: JSON.stringify({ rating: newRating }),
                            }).then(res => res.json())
                                .then(data => console.log('Rating saved', data))
                                .catch(console.error);
                        }}
                    />
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <p>Click to Know More About the author <Link style={{fontStyle:'italic'}} onClick={handleClick} to={`/aboutauthor/${blog.author?.username}`}>{blog.author?.username}</Link></p>
            </div>
        </div>
    );
}