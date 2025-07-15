import React from 'react';
import { Link } from 'react-router-dom';

const NotificationItem = ({ notification }) => {
    return (
        <div className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
            <p>{notification.message}</p>
            <Link to={`/read/${notification.blog._id}`}>View Blog</Link>
        </div>
    );
};

export default NotificationItem;
