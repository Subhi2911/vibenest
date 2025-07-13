import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import Spinner from './Spinner';

const Profile = (props) => {
    const [user, setUser] = useState(null);
    const host = 'http://localhost:5000'; 
    const token = localStorage.getItem("token");

    useEffect(() => { 
        const fetchUser = async () => {
            try {
                const response = await fetch(`${host}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });
                const json = await response.json();
                setUser(json);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token, host]);


    if (!user) {
        return (
            <div className='container' >
                <Spinner />
            </div>
        );
    }

    return (
        <div className='container my-3'>
            <div className='d-flex justify-content-center' >
                <div className='profile-image d-flex justify-content-center align-items-center'
                     style={{ width: '11.5rem', height: '11.5rem', backgroundColor: 'black', borderRadius: '50%' }}>
                    <Avatar name={user.username} size={40} />
                </div>
            </div>

            <div className='d-flex justify-content-center' >
                <p className="fw-semibold my-3">{user.email}</p>
            </div>
            <div className='d-flex justify-content-center' >
                <p style={{color:'#FFB433'}} className="small">User ID: {user._id}</p>
            </div>

            <table className="table table-bordered" >
                <tbody >
                    <tr >
                        <th style={{ color: '#FFB433', width: '40%', textAlign: 'center' }}>Username:</th>
                        <td style={{ textAlign: 'center' }}>{user.username}</td>
                    </tr>
                    <tr>
                        <th style={{ color: '#FFB433' ,width: '40%', textAlign: 'center'}}>Email:</th>
                        <td style={{textAlign: 'center' }}>{user.email}</td>
                    </tr>
                    <tr>
                        <th style={{  color: '#FFB433',width: '40%' , textAlign: 'center'}}>Date of Join:</th>
                        <td style={{ textAlign: 'center' }}>{new Date(user.date).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Profile;
