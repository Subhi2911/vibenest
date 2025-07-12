import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';

export default function Read() {
  const { id } = useParams();
  const { blogs } = useContext(BlogContext);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const found = blogs.find((b) => b._id === id);
    setBlog(found);
  }, [blogs, id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="container my-3">
        <img src={`http://localhost:5000${blog.imageurl}`} alt="cover" style={{ width: '100%', height:'50rem' }} />
        <h2 className='d-flex justify-content-center'>{blog.title}</h2>
        
        <p>{blog.content}</p>
    </div>
  );
}