import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import BlogContext from '../context/blogs/blogContext';
import Spinner from './Spinner';
import Ratings from './Ratings';

export default function Read(props) {
  const { id } = useParams();
  const { blogs, getBlogById } = useContext(BlogContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const host = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      props.setprogress(10);

      // Must check auth first
      if (!token || token === 'undefined' || token === 'null') {
        props.setprogress(100);
        navigate('/login');
        setLoading(false);
        return;
      }

      props.setprogress(30);
      const found = blogs.find(b => b._id === id);

      if (found) {
        setBlog(found);
        props.setprogress(100);
        setLoading(false);
      } else {
        try {
          props.setprogress(50);
          const fetched = await getBlogById(id);
          props.setprogress(80);
          if (fetched) {
            setBlog(fetched);
          } else {
            console.warn('Blog not found');
          }
        } catch (err) {
          console.error('Fetching blog failed:', err);
        } finally {
          props.setprogress(100);
          setLoading(false);
        }
      }
    };

    fetchData();
    // Only re-run if id changes or blogs context changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, blogs]);

  if (loading) {
    return <div className="d-flex justify-content-center my-5"><Spinner /></div>;
  }

  if (!blog) {
    return <p className="text-center my-5">Blog not found.</p>;
  }

  const formattedDate = new Date(blog.updatedAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
        <div style={{ marginTop: '1rem' }}>
            <div className="container my-2">
                <h2 className="d-flex justify-content-center my-3">{blog.title}</h2>
                <div className="d-flex flex-column align-items-end mb-3">
                    <small className="my-1">Category: {blog.category}</small>
                    <figcaption className="blockquote-footer my-2">
                        Published by <cite title="Author">{blog.author?.username}</cite>
                    </figcaption>
                    <small className="text-body-secondary">Last updated {formattedDate}</small>
                </div>

                <img src={blog.imageurl} alt="cover" style={{ width: '100%', height: 'auto' }} />

                <div className="my-4" dangerouslySetInnerHTML={{ __html: blog.content }} />

                <hr />

                <div className="d-flex justify-content-center">
                    <p className="mx-3 my-2">Rate The Blog</p>
                    <Ratings
                        blogId={blog._id}
                        initialRating={blog.averageRating}
                        onRate={(newRating) => {
                            fetch(`${host}/api/blogs/${blog._id}/rate`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'auth-token': token,
                                },
                                body: JSON.stringify({ rating: newRating }),
                            })
                                .then(res => res.json())
                                .catch(console.error);
                        }}
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <p>
                        Click to know more about the author{' '}
                        <Link style={{ fontStyle: 'italic' }} to={`/aboutauthor/${blog.author?.username}`}>
                            {blog.author?.username}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
