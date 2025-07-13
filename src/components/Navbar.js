import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const host = 'http://localhost:5000'
    const navigate= useNavigate();

    const token = localStorage.getItem('token');
    const offcanvasRef = useRef();

    const closeOffcanvas = () => {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${host}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("token"),
                    },
                });
                const json = await response.json();
                setUser(json);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);
    const location=useLocation()
    const bordercolor= (location.pathname==='/myblogs'||location.pathname==='/profile')?'#FFB433':'';
    return (
        <>
            <nav className="navbar bg-body-tertiary px-3 py-2">
                <div
                    className="d-flex align-items-center justify-content-between"
                    style={{
                        width: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {/* Left - Logo */}
                    <div className="d-flex align-items-center me-3" style={{ flexShrink: 0 }}>
                        <i className="fa-solid fa-bars fs-5" style={{ cursor: 'pointer' }}></i>
                        <h5 className="navbar-brand mb-0 ms-3">VibeNest</h5>
                    </div>
                    <div style={{ width: '30rem' }}>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>


                    {/* Right - Create, Notification, Avatar */}
                    <div
                        className="d-flex align-items-center "
                        style={{ justifyContent: 'space-between', gap: '1rem' }}
                    >
                        <Link
                            to="/addBlog"
                            className="d-flex align-items-center text-decoration-none text-dark"
                            style={{ fontSize: '1.5rem' }}
                        >
                            <i className="fa-solid fa-plus me-1"></i>
                            <span className="d-none d-sm-inline">Create</span>
                        </Link>

                        <Link
                            to="/notifications"
                            className="text-dark fs-5"
                            style={{ textDecoration: 'none', fontSize: '1.5rem' }}
                        >
                            <i className="fa-solid fa-bell"></i>
                        </Link>

                        {user && (
                            <div
                                style={{ cursor: "pointer", width: '2.4rem', height: '2.4rem', borderRadius: '50%', border: bordercolor ? `2px solid ${bordercolor}` : 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#userOffcanvas"
                                aria-controls="userOffcanvas"

                            >
                                <Avatar name={user.username} width="2" height="2" size="16" />
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* Offcanvas for User */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="userOffcanvas"
                aria-labelledby="userOffcanvasLabel"
                
                ref={offcanvasRef}
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="userOffcanvasLabel">Your Account</h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body ">
                    {user && <div className='container'>
                        <div className='d-flex justify-content-center'  >
                            <div className='profile-image d-flex justify-content-center align-items-center' style={{ width: '11.5rem', height: '11.5rem', backgroundColor: 'black', borderRadius: '50%' }}>
                                <Avatar name={user.username}  size={40} />
                            </div>

                        </div>
                        <div className='d-flex  justify-content-center'>
                            <p className="fw-semibold my-3" >{user.email}</p>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <p className="text-muted small" >User ID: {user._id}</p>
                        </div>
                    </div>}
                    <ul className="list-group">
                        <li className="list-group-item" >
                            <Link onClick={() => { closeOffcanvas(); }} to="/profile" className="text-decoration-none" style={{ color: 'black' }}>Profile</Link>
                        </li>
                        <li className="list-group-item" >
                            <Link onClick={() => { closeOffcanvas(); }} to="/myblogs" className="text-decoration-none" style={{ color: 'black' }}>My Blogs</Link>
                        </li>
                        <li className="list-group-item" >
                            <button onClick={() => { handleLogout(); closeOffcanvas(); }} className="btn btn-danger w-100"  >Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
