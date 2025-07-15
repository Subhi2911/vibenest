import React, { useContext, useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryNavbar from './CategoryNavbar';
import VerticalThinNavbar from './VerticalThinNavbar';
import NotificationBell from './NotificationBell';
import BlogContext from '../context/blogs/blogContext';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const host = process.env.BACKEND_URL
    const navigate = useNavigate();
    const offcanvasLeftRef = useRef();
    const offcanvasRef = useRef();
    const token = localStorage.getItem('token');
    const location = useLocation();
    const bordercolor = location.pathname === '/profile' ? '#FFB433' : '';
    const context = useContext(BlogContext);
    const { fetchNotifications } = context

    useEffect(() => {
        const load = async () => {
            await fetchNotifications();
        };
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeOffcanvas = () => {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current);
        if (bsOffcanvas) bsOffcanvas.hide();
    };

    const closeOffcanvasleft = () => {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasLeftRef.current);
        if (bsOffcanvas) bsOffcanvas.hide();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${host}/api/auth/getuser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                });
                const json = await response.json();
                setUser(json);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        if (token) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    return (
        <>
            {/* Navbar */}
            <nav className="navbar bg-body-tertiary px-3 sticky-top" style={{ height: '60px' }}>
                <div className="container-fluid d-flex align-items-center justify-content-between flex-nowrap">

                    {/* Left: Hamburger + Logo */}
                    <div className="d-flex align-items-center me-3" style={{ gap: '1rem' }}>
                        <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" style={{ position: 'fixed', left: '1rem', cursor: 'pointer' }}>
                            <i className="fa-solid fa-bars fs-5"></i>
                        </div>
                        <h5 className="navbar-brand mb-0 mx-4">VibeNest</h5>
                    </div>

                    {/* Center: Search */}
                    <div className="flex-grow-1 d-none d-md-block mx-2">
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search  (non-functional)" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>

                    {/* Right: Icons */}
                    <div className="d-flex align-items-center" style={{ gap: '0.6rem', minWidth: '160px' }}>
                        {/* Mobile search toggle */}
                        <button className="btn d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#searchCollapse" aria-expanded="false" aria-controls="searchCollapse">
                            <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '1.1rem' }}></i>
                        </button>

                        {/* Create Blog */}
                        <Link to="/addBlog" className="text-decoration-none text-dark d-flex align-items-center justify-content-center" style={{ fontSize: '1.5rem' }}>
                            <i className="fa-solid fa-plus"></i>
                            <span className="d-none d-sm-inline ms-1" style={{ fontSize: '0.9rem' }}>Create</span>
                        </Link>

                        {/* Notifications */}
                        <NotificationBell />

                        {/* Avatar / Signup */}
                        {user && token ? (
                            <div
                                className="d-flex justify-content-center align-items-center rounded-circle"
                                style={{
                                    width: '2',
                                    height: '2',
                                    border: bordercolor ? `2px solid ${bordercolor}` : 'none',
                                    cursor: 'pointer'
                                }}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#userOffcanvas"
                                aria-controls="userOffcanvas"
                            >
                                <Avatar name={user.username} width="2" height="2" size="18" />
                            </div>
                        ) : (
                            <Link to="/signup" className="btn btn-outline-primary px-2 py-1" style={{ fontSize: '0.8rem' }}>
                                Signup
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Search Collapse */}
            <div className="collapse d-md-none bg-body-tertiary p-3" id="searchCollapse">
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>

            {/* Left Sidebar Offcanvas */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" ref={offcanvasLeftRef}>
                <div className="offcanvas-header">
                    <i className="fa-solid fa-bars fs-5 mx-3" style={{ cursor: 'pointer' }} onClick={closeOffcanvasleft}></i>
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">VibeNest</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-group">
                        <li className="list-group-item border-top my-2"><i className="fa-solid fa-house mx-3"></i><Link onClick={closeOffcanvasleft} to="/" className="text-decoration-none text-dark">Home</Link></li>
                        <li className="list-group-item border-top my-2"><i className="fa-solid fa-file mx-3"></i><Link onClick={closeOffcanvasleft} to="/myblogs" className="text-decoration-none text-dark">My Blogs</Link></li>
                        <li className="list-group-item border-top my-2"><i className="fa-solid fa-user mx-3"></i><Link onClick={closeOffcanvasleft} to="/profile" className="text-decoration-none text-dark">You</Link></li>
                        {(!token || token === undefined || token === null)? (
                            <li className="list-group-item border-top my-2">
                                <i className="fa-solid fa-right-to-bracket mx-3"></i>
                                <Link onClick={closeOffcanvasleft} to="/login" className="text-decoration-none text-dark">Login</Link>
                            </li>
                        ):(
                            <li className=" list-group-item border-top my-2">
                                <i className="fa-solid fa-right-from-bracket mx-3" ></i>
                                <button type='button' onClick={() => { handleLogout(); closeOffcanvasleft(); }} to="/login" className=" text-dark text-decoration-none" style={{border:'none',backgroundColor:'transparent',padding:'0'}}>Logout</button>
                            </li>
                            
                        )}
                    </ul>

                    {/* Categories for Mobile */}
                    <ul className="list-group d-md-none mt-4">
                        <h6 className="mx-2 pt-3">Categories</h6>
                        {[
                            { to: '/Technology', icon: 'fa-sim-card', label: 'Technology' },
                            { to: '/Health', icon: 'fa-heart', label: 'Health & Wellness' },
                            { to: '/Travel', icon: 'fa-bus', label: 'Travel & Adventure' },
                            { to: '/Lifestyle', icon: 'fa-dna', label: 'Lifestyle' },
                            { to: '/Finance', icon: 'fa-business-time', label: 'Finance & Business' },
                            { to: '/Food', icon: 'fa-utensils', label: 'Food & Recipes' },
                            { to: '/Education', icon: 'fa-school', label: 'Education & Learning' },
                            { to: '/Spiritual', icon: 'fa-hands-praying', label: 'Spiritual' },
                        ].map(({ to, icon, label }) => (
                            <li key={to} className="list-group-item border-top my-2">
                                <i className={`fa-solid ${icon} mx-2`}></i>
                                <Link onClick={closeOffcanvasleft} to={to} className="text-decoration-none text-dark">{label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* User Account Offcanvas */}
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="userOffcanvas" aria-labelledby="userOffcanvasLabel" ref={offcanvasRef}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="userOffcanvasLabel">Your Account</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {user && (
                        <div className="container text-center">
                            <div className="profile-image d-flex justify-content-center align-items-center mx-auto mb-3" style={{ width: '11.5rem', height: '11.5rem', backgroundColor: 'black', borderRadius: '50%' }}>
                                <Avatar name={user.username} size={40} />
                            </div>
                            <p className="fw-semibold my-2">{user.email}</p>
                            <p className="text-muted small">User ID: {user._id}</p>
                        </div>
                    )}
                    <ul className="list-group">
                        <li className="list-group-item">
                            <Link onClick={closeOffcanvas} to="/profile" className="text-decoration-none text-dark">Profile</Link>
                        </li>
                        <li className="list-group-item">
                            <button onClick={() => { handleLogout(); closeOffcanvas(); }} className="btn btn-danger w-100">Logout</button>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Thin Vertical Navbar for lg+ */}
            <div className="d-none d-lg-flex flex-column align-items-center">
                <VerticalThinNavbar />
            </div>

            {/* Spacer for CategoryNavbar positioning */}
            <div className="d-none d-md-block" style={{ height: '57px' }}></div>

            {/* Category Navbar */}
            <div className="d-none d-md-block">
                <CategoryNavbar />
            </div>
        </>
    );
}
