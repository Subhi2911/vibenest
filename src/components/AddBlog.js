import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BlogContext from '../context/blogs/blogContext';
import { useNavigate } from 'react-router-dom';

export default function AddBlog() {
    const navigate = useNavigate();
    const { addBlog } = useContext(BlogContext);
    const [content, setContent] = useState('');
    const token = localStorage.getItem('token')
    const [blog, setBlog] = useState({
        imageurl: '',
        title: '',
        content: '',
        category: ''
    });
    const [coverFile, setCoverFile] = useState(null);
    const [coverUrl, setCoverUrl] = useState('');
    const categories = [
        'Technology',
        'Health & Wellness',
        'Travel & Adventure',
        'Lifestyle',
        'Finance & Business',
        'Food & Recipes',
        'Education & Learning',
        'Entertainment & Culture',
        'Spiritual'
    ];
    useEffect(() => {
        if (!token || token === undefined || token === null) {
            return navigate('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        if (!blog.imageurl || !blog.title || !blog.content || !blog.category) {
            alert("All fields are required!");
            return;
        }

        addBlog(blog.title, blog.content, blog.imageurl, blog.category);
        navigate('/');
    };

    return (
        <div className="container my-4" style={{ marginTop: '5rem' }}>
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
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={blog.category} onChange={handleChange} required>
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                        <option value={cat} key={index}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="title" className="form-label">Blog Title</label>
                <input
                    type="text"
                    className="form-control"
                    name="title"
                    maxLength={100}
                    minLength={5}
                    value={blog.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                />
                <div style={{ height: '2rem', visibility: (blog.title.length > 100 || blog.title.length < 5) ? 'visible' : 'hidden' }} className='form-text'>Minimum 5  and Maximum 100 Characters required</div>
            </div>

            <div className="mb-3">
                <label htmlFor="content" className="form-label">Content</label>
                <ReactQuill
                    theme="snow"
                    value={content}
                    maxLength={2000}
                    minLength={25}
                    onChange={(value) => {
                        setContent(value);
                        setBlog({ ...blog, content: value });
                    }}
                />
                <div style={{ height: '2rem', visibility: (blog.content.length > 6000 || blog.content.length < 25) ? 'visible' : 'hidden' }} className='form-text'>Minimum 25  and Maximum 6000 Characters required</div>
            </div>

            <button className="btn btn-primary" onClick={handleSubmit}
                disabled={blog.title.length < 5 || blog.content.length < 5 || blog.content.length > 6000 || blog.title.length > 100}
            >
                Publish Blog
            </button>
        </div>
    );
}
