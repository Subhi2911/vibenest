import React, { useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BlogContext from '../context/blogs/blogContext';
import { useNavigate } from 'react-router-dom';

export default function AddBlog() {
    const navigate= useNavigate();
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

    const htmlToPlainText=(html)=> {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }

    const uploadCover = async () => {
        const formData = new FormData();
        formData.append('image', coverFile);

        const res = await fetch('http://localhost:5000/api/blogs/upload-image', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        setCoverUrl(data.url);
        setBlog({ ...blog, imageurl: data.url });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!blog.imageurl || !blog.title || !content) {
            alert("All fields are required!");
            return;
        }
        const plainTextContent = htmlToPlainText(content);
        addBlog(blog.imageurl, blog.title, plainTextContent);
        navigate('/')
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
                        <img src={`http://localhost:5000${coverUrl}`} alt="Cover" width="300" />
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
