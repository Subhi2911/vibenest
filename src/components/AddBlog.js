import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BlogContext from '../context/blogs/blogContext';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

export default function AddBlog() {
    const navigate = useNavigate();
    const { addBlog } = useContext(BlogContext);
    const [content, setContent] = useState('');
    const token = localStorage.getItem('token')
    const host = process.env.REACT_APP_BACKEND_URL;
    const [uploadimage, setUploadimage] = useState(false)
    const [blog, setBlog] = useState({
        imageurl: '',
        title: '',
        content: '',
        isprivate: false,
        category: ''
    });
    const [coverFile, setCoverFile] = useState(null);
    const [coverUrl, setCoverUrl] = useState('');
    const categories = [
        'Technology',
        'Health',
        'Travel',
        'Lifestyle',
        'Love',
        'Finance',
        'Food',
        'Education',
        'Entertainment',
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

        setUploadimage(true); 
        const formData = new FormData();
        formData.append('image', coverFile);

        try {
            const res = await fetch(`${host}/upload-image`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setCoverUrl(data.imageUrl);
                setBlog({ ...blog, imageurl: data.imageUrl });
            } else {
                alert('Image upload failed: ' + data.error);
            }
        } catch (error) {
            alert('Upload error: ' + error.message);
        } finally {
            setUploadimage(false); 
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!blog.imageurl || !blog.title || !blog.content || !blog.category) {
            alert("All fields are required!");
            return;
        }

        addBlog(blog.title, blog.content, blog.imageurl, blog.isprivate, blog.category);
        navigate('/');
    };

    return (
        <div className="container my-4" style={{ marginTop: '5rem' }}>
            <h2>Create a Blog</h2>
            <div className='mb-3 my-3'>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="switchCheckDefault"
                        checked={blog.isprivate}
                        onChange={(e) =>
                            setBlog({ ...blog, isprivate: e.target.checked })
                        }
                    />
                    <label className="form-check-label" htmlFor="switchCheckDefault" style={{ fontWeight: '500' }}>{`Change to ${blog.isprivate ? " Public Blog" : " Private Blog"}`}</label>
                </div>
            </div>
            <div className="mb-3">
                <label htmlhtmlFor="cover" className="form-label" style={{ fontWeight: '500' }}>Cover Image</label>
                <input type="file" className="form-control" onChange={handleCoverChange} />
                <button className="btn btn-secondary mt-2" disabled={uploadimage} onClick={uploadCover}>
                    {uploadimage ? 'Uploading...' : 'Upload Cover'}
                </button>

                {uploadimage && (
                    <div className="mt-2 mx-5">
                        <Spinner />
                    </div>
                )}

                {!uploadimage && coverUrl && (
                    <div className="mt-3">
                        <img src={coverUrl} alt="Cover Preview" width="300" />
                    </div>
                )}


            </div>
            <div className="mb-3">
                <label className="form-label" style={{ fontWeight: '500' }}>Category</label>
                <select className="form-select" name="category" value={blog.category} onChange={handleChange} required>
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                        <option value={cat} key={index}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlhtmlFor="title" className="form-label" style={{ fontWeight: '500' }}>Blog Title</label>
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
                <label htmlhtmlFor="content" className="form-label" style={{ fontWeight: '500' }}>Content</label>
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
