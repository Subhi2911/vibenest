import React, { useContext, useEffect, useState } from 'react';
import BlogItem from './BlogItem';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Blogs(props) {
    const { getBlogs } = useContext(BlogContext);
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const limit = 6;

    useEffect(() => {
        const loadInitialBlogs = async () => {
            props.setprogress(10);
            const data = await getBlogs(1, limit);
            props.setprogress(30);
            if (data && data.blogs) {
                setBlogs(data.blogs);
                setTotalBlogs(data.total);
                setPage(2);
                if (data.blogs.length >= data.total) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
            props.setprogress(100);
        };
        loadInitialBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMoreData = async () => {
        const data = await getBlogs(page, limit);
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

    return (
        <div style={{ marginTop: '1rem', overflowX: 'hidden' }}> {/* Prevent horizontal scroll */}
            <div className="container my-4 text-center">
                <h2>VibeNest - Blogs</h2>
            </div>

            <div className="container my-3" style={{ overflowX: 'hidden' }}>
                <InfiniteScroll
                    dataLength={blogs.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <div className="d-flex justify-content-center my-3">
                            <Spinner />
                        </div>
                    }
                    endMessage={
                        <p className="text-center mt-4">
                            <b>You've reached the end!</b>
                        </p>
                    }
                >
                    <div
                        className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 justify-content-center"
                        style={{ marginLeft: 0, marginRight: 0 }} // Remove Bootstrap row negative margins
                    >
                        {blogs.map(blog => (
                            <div key={blog._id} className="col d-flex justify-content-center">
                                <BlogItem blog={blog} />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
}
