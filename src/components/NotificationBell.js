import React, { useContext } from 'react';
import BlogContext from '../context/blogs/blogContext';
import { Link, useLocation } from 'react-router-dom';

const NotificationBell = () => {
    const location=useLocation();
    const { notification } = useContext(BlogContext);
    const unread = notification?.some(n => !n.isRead); // null check added

    const isActive= location.pathname==='/notifications'

    return (
        <Link to="/notifications" className="position-relative">
            <i className="fa-solid fa-bell mx-2 my-1" style={{ color: isActive ? '#0d6efd' : 'black' , fontSize:'1.2rem'}}></i>
            {unread && (
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New notifications</span>
                </span>
            )}
        </Link>
    );
};

export default NotificationBell;
