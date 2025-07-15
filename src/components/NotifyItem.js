import React, { useEffect, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import moment from 'moment';
const host = process.env.REACT_APP_BACKEND_URL;

const NotifyItem = ({ notification }) => {
    const token= localStorage.getItem('token')
    const navigate=useNavigate();
    const [wasRead, setWasRead] = useState(notification.isRead);
    
    useEffect(()=>{
        if (!token || token === null || token === undefined){
            navigate('/login')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
   // Delay read-marking to allow red dot to show
  useEffect(() => {
    if (!notification.isRead) {
      const timer = setTimeout(async () => {
        try {
          await fetch(`${host}/api/notifications/${notification._id}/mark-read`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': token,
            },
          });
          setWasRead(true);
          
        } catch (err) {
          console.error('Error marking as read:', err);
        }
      }, 3000); // 3 second delay before marking as read

      return () => clearTimeout(timer); // Cleanup
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
    const categories = {
        General: '#000000',
        Technology: '#1E88E5',
        Health: '#43A047',
        Travel: '#F4511E',
        Lifestyle: '#8E24AA',
        Finance: '#3949AB',
        Food: '#D81B60',
        Education: '#FB8C00',
        Entertainment: '#5E35B1',
        Spiritual: '#00897B'
    };
    
    const relativeDate = moment(notification.date).fromNow();

    // Get the category from blog (assuming it's populated in backend)
    const category = notification.blog?.category || 'General';
    const color = categories[category] || '#000';

    return (
    <div className="w-100 my-3 d-flex justify-content-center" style={{ maxWidth: '600px', width: '90%', margin: '0 auto' }}>
        <div className="toast show w-100 shadow-sm position-relative" role="alert" aria-live="assertive" aria-atomic="true">
            {!wasRead && (
                <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                </span>
            )}
            <div className="toast-header" style={{backgroundColor:'#F6F6F6'}}>
                <div
                    className="rounded me-2"
                    style={{ backgroundColor: color, width: '1rem', height: '1rem' }}
                ></div>
                <Link to={`/read/${notification.blog._id}`} className="mx-2">
                    View Blog
                </Link>
                <small className="text-body-secondary ms-auto">{relativeDate}</small>
            </div>
            <div className="toast-body">
                {notification.message}
            </div>
        </div>
    </div>
);

};

export default NotifyItem;
