import React, { useContext, useEffect, useState, useRef } from 'react';
import BlogItem from './BlogItem';
import BlogContext from '../context/blogs/blogContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const MyBlogs = (props) => {
    const navigate=useNavigate();
    const context = useContext(BlogContext);
    const { blogs, fetchAuthorBlogs, editBlog } = context;
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [username, setUsername] = useState(null);
    const [blog, setBlog] = useState({ id: '', etitle: '', econtent: '', eimageurl: '' });
    const [coverUrl, setCoverUrl] = useState('');
    const ref = useRef(null);
    const refClose = useRef(null);

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (!userToken) navigate('/login');

        const fetchUsername = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/getuser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": userToken,
                    },
                });

                const json = await response.json();

                if (json?.username) {
                    setUsername(json.username);
                    fetchAuthorBlogs(json.username);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        fetchUsername();
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAuthorBlogs]);

    const updateBlog = (currentBlog) => {
        ref.current.click();
        setBlog({
            id: currentBlog._id,
            etitle: currentBlog.title,
            econtent: currentBlog.content,
            eimageurl: currentBlog.imageurl,
        });
        console.log("Editing blog:", currentBlog);
        console.log("Sending ID to editBlog:", currentBlog._id);
        setCoverUrl(currentBlog.imageurl);
        setTimeout(() => {
            ref.current?.click();
        }, 100);
    };



    const handleClick = async (e) => {
        e.preventDefault();
        console.log("Sending ID to editBlog:", blog.id);
        await editBlog(blog.id, blog.etitle, blog.econtent, blog.eimageurl);

        refClose.current.click();
        props?.showAlert?.("Blog Updated Successfully!!", "success");
    };

    const onChange = (e) => {
        setBlog({ ...blog, [e.target.name]: e.target.value });
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBlog({ ...blog, eimageurl: file });
        }

    };

    const uploadCover = async () => {
        const formData = new FormData();
        formData.append('image', blog.eimageurl);
        try {
            const response = await fetch('http://localhost:5000/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setCoverUrl(data.imageUrl);
            setBlog({ ...blog, eimageurl: data.imageUrl });
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const modalStyle = {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    };

    return (
        <div style={{ display: 'flex-wrap' }}>
            {/* Hidden trigger for modal */}
            <button
                type="button"
                ref={ref}
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                Open Modal
            </button>

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Blog</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Cover Image</label>
                                <input type="file" className="form-control" onChange={handleCoverChange} />
                                <button className="btn btn-secondary mt-2" onClick={uploadCover}>
                                    Upload Cover
                                </button>
                                {coverUrl && (
                                    <div className="mt-3">
                                        <img src={coverUrl} alt="Cover" width="300" />
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Blog Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="etitle"
                                    value={blog.etitle}
                                    onChange={onChange}
                                    placeholder="Enter blog title"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={blog.econtent}
                                    onChange={(value) => setBlog({ ...blog, econtent: value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer" style={modalStyle}>
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleClick}
                                disabled={blog.etitle.length < 5 || blog.econtent.length < 5}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog list */}
            <div className=' container my-3 text-center'>
                <h2>VibeNest-Your Blogs </h2>
            </div>
            {loading?(
                <div className="d-flex justify-content-center my-5">
                    <Spinner />
                </div>
            ):(
                <div className='container my-3'>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
                    {Array.isArray(blogs) && blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div key={blog._id} className="col d-flex justify-content-center">
                                <BlogItem blog={blog} updateBlog={updateBlog} />
                            </div>
                        ))
                    ) : (
                        <p>No blogs found.</p>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default MyBlogs;
