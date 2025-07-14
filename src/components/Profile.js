import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import Spinner from './Spinner';

const Profile = (props) => {
    const [user, setUser] = useState(null);
    const host = 'http://localhost:5000';
    const token = localStorage.getItem("token");
    const [bio, setBio] = useState('')
    const refClose = useRef(null);

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
                setBio(json.bio || ''); // initialize editable bio
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    const changeBio = async () => {
        try {
            const response = await fetch(`${host}/api/auth/changebio/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
                body: JSON.stringify({ bio }),
            });

            const json = await response.json();
            setUser(prev => ({ ...prev, bio: json.bio }));
            return true
        } catch (error) {
            console.error("Error changing bio:", error);
            return false
        }
    };


    const handleClick = async (e) => {
        e.preventDefault();
        await changeBio();
        const success = await changeBio(); // wait for API call to complete
        if (success && refClose.current) {
            refClose.current.click(); // close modal only if bio was saved
        }
    };


    if (!user) {
        return (
            <div className='container' >
                <Spinner />
            </div>
        );
    }

    const modalStyle = {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    };
    return (
        <>
            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Bio</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Bio</label>
                                <textarea
                                    rows='5'
                                    className="form-control"
                                    name="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Enter bio here"
                                />
                                <div style={{height:'2rem',visibility:bio.length>160?'visible':'hidden'}} className='form-text'>Maximum 160 Characters</div>
                            </div>

                        </div>
                        <div className="modal-footer" style={modalStyle}>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"  ref={refClose} >
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleClick}
                                disabled={bio.trim().length < 5|| bio.length>160}
                                ref={refClose}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

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
                    <p style={{ color: '#FFB433' }} className="small">User ID: {user._id}</p>
                </div>

                <table className="table table-bordered" >
                    <tbody >
                        <tr >
                            <th style={{ color: '#FFB433', width: '40%', textAlign: 'center' }}>Username:</th>
                            <td style={{ textAlign: 'left' }}>{user.username}</td>
                        </tr>
                        <tr>
                            <th style={{ color: '#FFB433', width: '40%', textAlign: 'center' }}>Email:</th>
                            <td style={{ textAlign: 'left' }}>{user.email}</td>
                        </tr>
                        <tr>
                            <th style={{ color: '#FFB433', width: '40%', textAlign: 'center' }}>Bio</th>
                            <td style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{user.bio} <button  
                                className='mx-3 btn btn-outline-primary'
                                type='button'
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal">
                                    Change Bio
                                </button>
                        </td>
                        </tr>
                        <tr>
                            <th style={{ color: '#FFB433', width: '40%', textAlign: 'center' }}>Date of Join:</th>
                            <td style={{ textAlign: 'left' }}>{new Date(user.date).toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Profile;
