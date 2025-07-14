import React, { useContext, useEffect, useState, useRef } from 'react';
import BlogItem from './BlogItem';
import BlogContext from '../context/blogs/blogContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Spinner from './Spinner';

export default function Blogs(props) {
    const context = useContext(BlogContext);
    const { blogs, getBlogs, editBlog } = context;
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState({ id: '', ecategory: '', etitle: '', econtent: '', eimageurl: '' });
    const [coverUrl, setCoverUrl] = useState('');
    const ref = useRef(null);
    const refClose = useRef(null);

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
        getBlogs().then(() => setLoading(false));
        // eslint-disable-next-line
    }, []);

    const updateBlog = (currentBlog) => {
        setBlog({
            id: currentBlog._id,
            ecategory: currentBlog.category || '',
            etitle: currentBlog.title,
            econtent: currentBlog.content,
            eimageurl: currentBlog.imageurl,
        });
        setCoverUrl(currentBlog.imageurl);

        setTimeout(() => {
            ref.current?.click(); // open modal after state updates
        }, 100);
    };

    const handleClick = async (e) => {
        e.preventDefault();
        await editBlog({
            id: blog.id,
            imageurl: blog.eimageurl,
            category: blog.ecategory,
            title: blog.etitle,
            content: blog.econtent
        });
        refClose.current.click();
        props.showAlert("Blog Updated Successfully!!", "success");
    };

    const onChange = (e) => {
        setBlog({ ...blog, [e.target.name]: e.target.value });
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        setBlog({ ...blog, eimageurl: file });
    };

    const uploadCover = async () => {
        const formData = new FormData();
        formData.append('image', blog.eimageurl);
        try {
            const response = await fetch('http://localhost:5000/api/blogs/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setCoverUrl(data.url);
            setBlog({ ...blog, eimageurl: data.url });
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    

    return (
        <>
            {/* Hidden trigger for modal */}
            <button
                type="button"
                ref={ref}
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                Launch Edit Modal
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
                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <div className="mb-3">
                                <label className="form-label">Cover Image</label>
                                <input type="file" className="form-control" onChange={handleCoverChange} />
                                <button className="btn btn-secondary mt-2" onClick={uploadCover}>
                                    Upload Cover
                                </button>
                                {(coverUrl || (typeof blog.eimageurl === 'string' && blog.eimageurl)) && (
                                    <div className="mt-3">
                                        <img src={coverUrl || blog.eimageurl} alt="Cover" width="300" />
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
                                    minLength={5}
                                    maxLength={100}
                                    value={blog.etitle}
                                    onChange={onChange}
                                    placeholder="Enter blog title"
                                />
                                <div style={{
                                    height: '2rem',
                                    visibility: (blog.etitle.length > 100 || blog.etitle.length < 5) ? 'visible' : 'hidden'
                                }} className='form-text'>Minimum 5 and Maximum 100 Characters required</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={blog.econtent}
                                    onChange={(value) => setBlog({ ...blog, econtent: value })}
                                />
                                <div style={{
                                    height: '2rem',
                                    visibility: (blog.econtent.length > 6000 || blog.econtent.length < 25) ? 'visible' : 'hidden'
                                }} className='form-text'>Minimum 25 and Maximum 6000 Characters required</div>
                            </div>
                        </div>

                        <div className="modal-footer" >
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleClick}
                                disabled={
                                    blog.etitle.length < 5 ||
                                    blog.etitle.length > 100 ||
                                    blog.econtent.length < 25 ||
                                    blog.econtent.length > 6000
                                }
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blog list */}
            <div className='container my-4 text-center'>
                <h2>VibeNest - Blogs</h2>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner />
                </div>
            ) : (
                <div className="container my-3">
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
                        {Array.isArray(blogs) && [...blogs].reverse().map((blogItem) => (
                            <div key={blogItem._id} className="col d-flex justify-content-center">
                                <BlogItem blog={blogItem} updateBlog={updateBlog} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
