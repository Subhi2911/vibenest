// components/Notifications.js
import React, { useEffect, useState, useContext } from 'react';
import BlogContext from '../context/blogs/blogContext';
import NotifyItem from './NotifyItem';
import Spinner from './Spinner';

const Notifications = () => {
    const { fetchNotifications } = useContext(BlogContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchNotifications();
            setNotifications(data);
            setLoading(false);
        };
        load();
    }, [fetchNotifications]);

    if (loading) return <Spinner />;

    return (
        <div style={{marginTop:'1rem'}}>
            <div className="container my-3 ">
                <h3>Notifications</h3>
                {notifications.length === 0 ? (
                    <p>No notifications yet.</p>
                ) : (
                    notifications.map(n => <NotifyItem key={n._id} notification={n} />)
                )}
            </div>
        </div>
    );
};

export default Notifications;
