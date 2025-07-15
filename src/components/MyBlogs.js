import React, { useContext, useEffect, useState, useRef } from 'react';
import BlogItem from './BlogItem';
import BlogContext from '../context/blogs/blogContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

const MyBlogs = (props) => {
    const navigate = useNavigate();
    const context = useContext(BlogContext);
    const { fetchAuthorBlogs, editBlog } = context;
    const host = process.env.REACT_APP_BACKEND_URL;

    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);

    // Pagination & blogs state
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [blog, setBlog] = useState({ id: '', ecategory: '', etitle: '', econtent: '', eisprivate: false, eimageurl: '' });
    const [coverUrl, setCoverUrl] = useState('');
    const ref = useRef(null);
    const refClose = useRef(null);
    const [uploadimage, setUploadimage]=useState(false);

    const categories = [
        'General', 'Technology', 'Health', 'Travel', 'Lifestyle',
        'Finance', 'Food', 'Education', 'Entertainment', 'Spiritual'
    ];

    useEffect(() => {
        const userToken = localStorage.getItem('token');
        if (!userToken) return navigate('/login');

        const fetchUsernameAndBlogs = async () => {
            props.setprogress(10);
            try {
                const response = await fetch(`${host}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": userToken,
                    },
                });
                props.setprogress(50);
                const json = await response.json();
                props.setprogress(70);
                if (json?.username) {
                    setUsername(json.username);

                    // Fetch first page of blogs
                    const data = await fetchAuthorBlogs(json.username, 1, 6);
                    if (data) {
                        setBlogs(data.blogs || []);
                        setTotalBlogs(data.total || 0);
                        setPage(2);
                        if ((data.blogs?.length || 0) >= (data.total || 0)) {
                            setHasMore(false);
                        }
                    } else {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user or blogs:", error);
            }
            props.setprogress(100);
            setLoading(false);
        };

        fetchUsernameAndBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMoreData = async () => {
        if (!username) return;

        const data = await fetchAuthorBlogs(username, page, 6);
        if (data && data.blogs && data.blogs.length > 0) {
            setBlogs(prev => [...prev, ...data.blogs]);
            setPage(prev => prev + 1);

            if (blogs.length + data.blogs.length >= totalBlogs) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
    };

    const updateBlog = (currentBlog) => {
        setBlog({
            id: currentBlog._id,
            etitle: currentBlog.title,
            ecategory: currentBlog.category || 'General',
            econtent: currentBlog.content,
            eimageurl: currentBlog.imageurl,
            eisprivate: currentBlog.isprivate
        });
        setCoverUrl(currentBlog.imageurl);
        ref.current?.click();
    };

    const handleClick = async (e) => {
        e.preventDefault();
        await editBlog(blog.id, blog.etitle, blog.econtent, blog.eimageurl, blog.eisprivate, blog.ecategory);
        refClose.current?.click();
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
        if (!(blog.eimageurl instanceof File)) {
            props?.showAlert?.("Please select an image to upload.", "warning");
            return;
        }
        setUploadimage(true);
        const formData = new FormData();
        formData.append('image', blog.eimageurl);

        try {
            const response = await fetch(`${host}/upload-image`, {
                method: 'POST',
                body: formData,
                headers: {
                    "auth-token": localStorage.getItem('token'),
                },
            });
            const data = await response.json();
            setCoverUrl(data.url || data.imageUrl);
            setBlog({ ...blog, eimageurl: data.url || data.imageUrl });
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploadimage(false); 
        }
    };

    return (
        <div style={{ flexWrap: 'wrap', marginTop: '1rem' }}>
            {/* Hidden Modal Trigger */}
            <button
                type="button"
                ref={ref}
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                Open Modal
            </button>

            {/* Edit Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Blog</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="form-check form-switch mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="switchCheckDefault"
                                    checked={blog.eisprivate}
                                    onChange={(e) => setBlog({ ...blog, eisprivate: e.target.checked })}
                                />
                                <label className="form-check-label" htmlFor="switchCheckDefault" style={{ fontWeight: '500' }}>
                                    {`Change to ${blog.eisprivate ? "Public" : "Private"} Blog`}
                                </label>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" style={{ fontWeight: '500' }}>Cover Image</label>
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
                                <select
                                    className="form-select"
                                    name="ecategory"
                                    value={blog.ecategory}
                                    onChange={onChange}
                                    required
                                    style={{ background: 'white' }}
                                >
                                    <option value="" style={{ fontWeight: '500' }}>Select a category</option>
                                    {categories.map((cat, index) => (
                                        <option value={cat} key={index}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label" style={{ fontWeight: '500' }}>Blog Title</label>
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
                                <label className="form-label" style={{ fontWeight: '500' }}>Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={blog.econtent}
                                    onChange={(value) => setBlog({ ...blog, econtent: value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-end gap-2 mt-2">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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

            {/* Blog List */}
            <div className='container my-3 text-center'>
                <h2>VibeNest - Your Blogs</h2>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center my-5"><Spinner /></div>
            ) : (
                <InfiniteScroll
                    dataLength={blogs.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<div className="d-flex justify-content-center my-3"><Spinner /></div>}
                    endMessage={<p className="text-center mt-4"><b>You've reached the end!</b></p>}
                >
                    <div className='container my-3'>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
                            {Array.isArray(blogs) && blogs.length > 0 ? (
                                [...blogs].reverse().map((blog) => (
                                    <div key={blog._id} className="col d-flex justify-content-center">
                                        <BlogItem blog={blog} updateBlog={updateBlog} />
                                    </div>
                                ))
                            ) : (
                                <div className='text-center'>
                                    <p>No blogs found.</p>
                                    <p className='my-2'>Start by creating one...</p>
                                    <Link className='btn btn-outline-primary mx-2' to='/addblog'>Create Blog</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </InfiniteScroll>
            )}
        </div>
    );
};

export default MyBlogs;
