import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CategoryNavbar from './CategoryNavbar';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const host = 'http://localhost:5000'
    const navigate = useNavigate();
    const offcanvasLeftRef = useRef();
    const token = localStorage.getItem('token');
    const offcanvasRef = useRef();

    const closeOffcanvas = () => {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasRef.current);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }
    };
    const closeOffcanvasleft = () => {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasLeftRef.current);
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
    const location = useLocation()
    const bordercolor = (location.pathname === '/profile') ? '#FFB433' : '';
    return (
        <>
            <nav className="navbar bg-body-tertiary px-3 py-2 sticky-top">
                <div
                    className="container-fluid d-flex justify-content-between align-items-center flex-nowrap"
                    style={{
                        width: '100%',
                        flexWrap: 'wrap',
                        overflowX: 'hidden'
                    }}
                >
                    {/* Left - Logo */}
                    <div className="d-flex align-items-center me-3" style={{ flexShrink: 0 }}>
                        <div type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                            <i className="fa-solid fa-bars fs-5" style={{ cursor: 'pointer' }}></i>
                        </div>

                        <h5 className="navbar-brand mb-0 ms-3">VibeNest</h5>
                    </div>


                    {/* Search Section */}
                    <div className="d-flex align-items-center">
                        {/* Search button (small screens only) */}
                        <button
                            className="btn d-md-none me-2 "
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#searchCollapse"
                            aria-expanded="false"
                            aria-controls="searchCollapse"
                            style={{ fontSize: '1.2rem' }}
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>

                        {/* Inline search form on md+ */}
                        <div className="d-flex align-items-center flex-grow-1 mx-3">
                            <form className="d-none d-md-flex w-100" role="search" style={{ maxWidth: '100%' }}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                />
                                <button className="btn btn-outline-success" type="submit">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>



                    {/* Right - Create, Notification, Avatar */}
                    <div
                        className="d-flex align-items-center flex-nowrap"
                        style={{ justifyContent: 'flex-start', gap: '1.4rem', minWidth: '200px' }}
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
                                className="d-flex justify-content-center align-items-center rounded-circle"
                                style={{
                                    width: '2.2em',
                                    height: '2.2em',
                                    border: bordercolor ? `2px solid ${bordercolor}` : 'none',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}
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
            {/* Collapsible search for small screens (below navbar) */}
            <div className="collapse d-md-none bg-body-tertiary p-3" id="searchCollapse">
                <form className="d-flex" role="search">
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="submit">
                        Search
                    </button>
                </form>
            </div>
            {/* Offcanvas for User -right*/}
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
                                <Avatar name={user.username} size={40} />
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
                        {/* <li className="list-group-item" >
                            <Link onClick={() => { closeOffcanvas(); }} to="/myblogs" className="text-decoration-none" style={{ color: 'black' }}>My Blogs</Link>
                        </li> */}
                        <li className="list-group-item" >
                            <button onClick={() => { handleLogout(); closeOffcanvas(); }} className="btn btn-danger w-100"  >Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
            {/*off canvas left*/}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel" ref={offcanvasLeftRef}>
                <div className="offcanvas-header">
                    <div  >
                        <i className="fa-solid fa-bars fs-5 mx-3" style={{ cursor: 'pointer' }} onClick={closeOffcanvasleft}></i>
                    </div>
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">VibeNest</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="list-group">
                        <li className="list-group-item border-top my-2" >
                            <i className="fa-solid fa-house mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/" className="text-decoration-none" style={{ color: 'black' }}>Home</Link>
                        </li>
                        <li className="list-group-item border-top my-2" >
                            <i className="fa-solid fa-file mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/myblogs" className="text-decoration-none" style={{ color: 'black' }}>My Blogs</Link>
                        </li>
                        <li className="list-group-item border-top my-2" >
                            <i className="fa-solid fa-user mx-3"></i>
                            <Link onClick={closeOffcanvasleft} to="/profile" className="text-decoration-none" style={{ color: 'black' }}>You</Link>
                        </li>
                        
                        {/* Categories only visible on small screens inside offcanvas */}
                        <ul className="list-group d-md-none mt-4">
                            <h6 className=" mx-2" style={{paddingTop:'1.5rem'}}>Categories</h6>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-sim-card mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/technology'>Technology</Link></li>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-heart mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/health'>Health & Wellness</Link></li>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-bus mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/travel'>Travel & Adventure</Link></li>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-dna mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/lifestyle'>Lifestyle</Link></li>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-business-time mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/finance'>Finance & Business</Link></li>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-utensils mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/food'>Food & Recipes</Link></li>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-school mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/education'>Education & Learning</Link></li>
                            <li className="list-group-item border-top my-2"><i className="fa-solid fa-hands-praying mx-2"></i><Link onClick={closeOffcanvasleft} className="text-decoration-none" style={{ color: 'black' }} aria-current="page" to='/spiritual'>Spiritual</Link></li>

                        </ul>
                        {/* <li className="list-group-item" >
                            <button onClick={() => { handleLogout(); closeOffcanvas(); }} className="btn btn-danger w-100"  >Logout</button>
                        </li> */}
                    </ul>
                </div>
            </div>
            {/* Show CategoryNavbar only on md and larger screens */}
            <div className="d-none d-md-block">
                <CategoryNavbar />
            </div>
        </>
    );
}
