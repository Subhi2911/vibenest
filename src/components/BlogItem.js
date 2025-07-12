import React, { useContext } from 'react';
import BlogContext from '../context/blogs/blogContext';
import { useNavigate } from 'react-router-dom';
import Read from './Read';

export default function BlogItem(props) {
    const navigate = useNavigate
    const context = useContext(BlogContext);
    const{blog}=props;
    const handleClick=()=>{
        navigate('/read') 
    }

    
    return (
        <div >
            <div className="card" style={{width:'18rem'}}>
                <span className=" badge rounded-pill bg-danger " style={{display:'flex',
                justifyContent:'flex-end', 
                position:'absolute',
                right:'0'}}
                >
                {blog.author?.username}
                
                </span>
                <img src={`http://localhost:5000${blog.imageurl}`} className="card-img-top" alt="image-top" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    <div className="card-body">
                        <h5 className="card-title">{blog.title}</h5>
                        <p className="card-text">{blog.content}</p>
                        <button onClick={handleClick} className="btn btn-primary">Read</button>
                    </div>
            </div>
        </div>
    )
}
