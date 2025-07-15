import React, { useEffect, useState, useContext } from 'react';
import BlogContext from '../context/blogs/blogContext';
import NotifyItem from './NotifyItem';
import Spinner from './Spinner';

const Notify = (props) => {
    const { fetchNotifications, notification } = useContext(BlogContext);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const load = async () => {
            await fetchNotifications();
            setLoading(false);
        };
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchNotifications]);

    useEffect(() => {
        props.setprogress(0);
        const load = async () => {
            props.setprogress(50);
            await fetchNotifications();
            props.setprogress(70)
            setLoading(false);
            props.setprogress(100)

        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (loading) return <div className='container text-center'><Spinner /></div>


    return (
        <div style={{ marginTop: '1rem' }}>
            <div className="container my-3 text-center">
                <h3>Notifications</h3>
                {notification.length === 0 ? (
                    <p>No notifications yet.</p>
                ) : (
                    <div className="d-flex flex-column align-items-center">
                        {notification.map((n) => (
                            <NotifyItem key={n._id} notification={n} />
                        ))}
                    </div>
                    )
                }
            </div>
        </div>
    );
};

export default Notify;
