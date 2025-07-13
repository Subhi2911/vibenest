import React, { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BlogContext from '../context/blogs/blogContext';
import { useNavigate } from 'react-router-dom';

export default function AddBlog() {
  const navigate = useNavigate();
  const { addBlog } = useContext(BlogContext);
  const [content, setContent] = useState('');
  const [blog, setBlog] = useState({
    imageurl: '',
    title: '',
    content: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const uploadCover = async () => {
    if (!coverFile) {
      alert('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', coverFile);

    try {
      const res = await fetch('http://localhost:5000/upload-image', {  // Your cloud upload backend route
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        // data.imageUrl is full Cloudinary URL
        setCoverUrl(data.imageUrl);
        setBlog({ ...blog, imageurl: data.imageUrl });
      } else {
        alert('Image upload failed: ' + data.error);
      }
    } catch (error) {
      alert('Upload error: ' + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!blog.imageurl || !blog.title || !blog.content) {
      alert("All fields are required!");
      return;
    }
    
    addBlog(blog.imageurl, blog.title, blog.content);
    navigate('/');
  };

  return (
    <div className="container my-4">
      <h2>Create a Blog</h2>

      <div className="mb-3">
        <label htmlFor="cover" className="form-label">Cover Image</label>
        <input type="file" className="form-control" onChange={handleCoverChange} />
        <button className="btn btn-secondary mt-2" onClick={uploadCover}>Upload Cover</button>
        {coverUrl && (
          <div className="mt-3">
            {/* Use the full URL directly, no localhost prefix */}
            <img src={coverUrl} alt="Cover" width="300" />
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="title" className="form-label">Blog Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Enter blog title"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="content" className="form-label">Content</label>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={(value) => {
            setContent(value);
            setBlog({ ...blog, content: value });
          }}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Publish Blog
      </button>
    </div>
  );
}
