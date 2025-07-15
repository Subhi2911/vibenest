import React, { useContext, useEffect, useState, useRef } from 'react';
import BlogItem from './BlogItem';
import BlogContext from '../context/blogs/blogContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const MyBlogs = (props) => {
    const navigate = useNavigate();
    const context = useContext(BlogContext);
    const { blogs, fetchAuthorBlogs, editBlog } = context;
    const host = process.env.BACKEND_URL
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [username, setUsername] = useState(null);
    const [blog, setBlog] = useState({ id: '', ecategory: '', etitle: '', econtent: '', eisprivate: false, eimageurl: '' });
    const [coverUrl, setCoverUrl] = useState('');
    const ref = useRef(null);
    const refClose = useRef(null);
    const categories = [
        'General',
        'Technology',
        'Health',
        'Travel',
        'Lifestyle',
        'Finance',
        'Food',
        'Education',
        'Entertainment',
        'Spiritual'
    ];

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (!userToken) navigate('/login');

        const fetchUsername = async () => {
            try {
                const response = await fetch(`${host}/api/auth/getuser`, {
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
            ecategory: currentBlog.category || 'General',
            econtent: currentBlog.content,
            eimageurl: currentBlog.imageurl,
            eisprivate: currentBlog.isprivate
        });
        
        setCoverUrl(currentBlog.imageurl);
        setTimeout(() => {
            ref.current?.click();
        }, 100);
    };

    useEffect(() => {
        if (blog.id) {
            ref.current?.click();
        }
    }, [blog.id]);

    const handleClick = async (e) => {
        e.preventDefault();
        console.log("Sending ID to editBlog:", blog.id);
        await editBlog(blog.id, blog.etitle, blog.econtent, blog.eimageurl, blog.eisprivate, blog.ecategory);

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
            const response = await fetch(`${host}/upload-image`, {
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
        <div style={{ display: 'flex-wrap', marginTop: '1rem' }}>
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
                            <div className='mb-3 my-3'>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="switchCheckDefault"
                                        checked={blog.eisprivate}
                                        onChange={(e) =>
                                            setBlog({ ...blog, eisprivate: e.target.checked })
                                        }
                                    />
                                    <label className="form-check-label" for="switchCheckDefault" Style={{ fontWeight: '500' }}>{`Change to ${blog.eisprivate ? "Public" : "Private"} Blog`}</label>
                                </div>
                            </div>
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
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    name="ecategory"
                                    value={blog.ecategory}
                                    onChange={onChange}
                                    required
                                    style={{ background: 'white' }}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat, index) => (
                                        <option value={cat} key={index}>{cat}</option>
                                    ))}
                                </select>
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
                                    <BlogItem blog={blog} updateBlog={updateBlog} />
                                </div>
                            ))
                        ) : (
                            <div className='text-center'>
                                <p >No blogs found.</p>
                                <div >
                                    <p className='my-2'>Start by creating one..</p>
                                    <Link className=' mx-4 btn btn-outline-primary' to='/addblog' type='button'>Create Blog</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBlogs;
