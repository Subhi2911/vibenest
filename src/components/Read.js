import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';

export default function Read() {
  const { id } = useParams();
  const { blogs } = useContext(BlogContext);
  const [blog, setBlog] = useState(null);
  const navigate=useNavigate()

  useEffect(()=>{
        const found = blogs.find((b) => b._id === id);
        setBlog(found);
        const token= localStorage.getItem('token');
        
        if(!token || token === 'undefined' || token === 'null'){
            navigate('/login')
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ blogs, id])


  if (!blog) return <p>Loading...</p>;

  return (
    <div className="container my-3">
        <h2 className='d-flex justify-content-center my-3'>{blog.title}</h2>
        
        <img src={blog.imageurl} alt="cover" style={{ width: '100%', height:'auto' }} />
        
        <div className="my-4" dangerouslySetInnerHTML={{ __html: blog.content }} />
        
    </div>
  );
}