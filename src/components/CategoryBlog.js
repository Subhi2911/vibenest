import React, { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import BlogItem from './BlogItem';
import InfiniteScroll from 'react-infinite-scroll-component';

const CategoryBlog = (props) => {
    const context = useContext(BlogContext);
    const { fetchCatBlogs } = context;
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const limit = 6; // number of blogs per fetch

    const loadBlogs = async (pageToLoad = 1) => {
        if (loadingMore) return; // prevent multiple calls
        setLoadingMore(true);
        try {
            const data = await fetchCatBlogs(props.category, pageToLoad, limit);
            if (data) {
                if (pageToLoad === 1) {
                    setBlogs(data.blogs || []);
                } else {
                    setBlogs(prev => [...prev, ...(data.blogs || [])]);
                }
                // Check if we fetched all blogs
                if ((blogs.length + (data.blogs?.length || 0)) >= data.total) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                setPage(pageToLoad + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching category blogs:", error);
            setHasMore(false);
        }
        setLoading(false);
        setLoadingMore(false);
    };

    useEffect(() => {
        setLoading(true);
        setHasMore(true);
        setPage(1);
        setBlogs([]);
        loadBlogs(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.category]);

    return (
        <div style={{ marginTop: '1rem' }}>
            <div className='container my-4'>
                <div className='text-center'>
                    <h2>VibeNest - {props.category} Blog</h2>
                </div>

                {loading && blogs.length === 0 ? (
                    <div className="d-flex justify-content-center my-5">
                        <Spinner />
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={blogs.length}
                        next={() => loadBlogs(page)}
                        hasMore={hasMore}
                        loader={<div className="d-flex justify-content-center my-3"><Spinner /></div>}
                        endMessage={<p className="text-center mt-4"><b>You have seen all blogs.</b></p>}
                    >
                        <div className='container my-3'>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center">
                                {Array.isArray(blogs) && blogs.length > 0 ? (
                                    [...blogs].reverse().map((blog) => (
                                        <div key={blog._id} className="col d-flex justify-content-center">
                                            <BlogItem blog={blog} />
                                        </div>
                                    ))
                                ) : (
                                    <div className='text-center'>
                                        <p>No blogs found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </div>
    );
};

export default CategoryBlog;
