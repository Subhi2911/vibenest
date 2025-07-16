import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CategoryNavbar() {
    const location = useLocation();
    let myStyle = {
        WebkitTextStroke: '0.3px black',
        fontSize: '0.9rem',
        width: '100%',
        display: 'block',
        whiteSpace: 'nowrap'
    };

    return (
        <nav
            className="navbar navbar-expand-lg d-none d-md-flex"
            style={{
                backgroundColor: 'rgb(180 184 187)',
                position: 'fixed',
                top: '60px', // below your main navbar
                left: 0,
                right: 0,
                zIndex: '1000',
                height: '48px',
                paddingLeft: '60px',
                overflow: 'hidden',         // Prevent internal scrollbars
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
            }}
        >
            <div className="container-fluid">
                <div className="collapse navbar-collapse show">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex-nowrap w-100">
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Technology' ? 'active' : ''}`} style={{ color: '#1E88E5', ...myStyle }}  to='/Technology'>Technology</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Health' ? 'active' : ''}`} style={{ color: '#43A047', ...myStyle }}  to='/Health'>Health & Wellness</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Travel' ? 'active' : ''}`} style={{ color: '#F4511E', ...myStyle }}  to='/Travel'>Travel & Adventure</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Lifestyle' ? 'active' : ''}`} style={{ color: '#8E24AA', ...myStyle }}  to='/Lifestyle'>Lifestyle</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Love' ? 'active' : ''}`} style={{ color: '#DC2525', ...myStyle }}  to='/Love'>Love</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Finance' ? 'active' : ''}`} style={{ color: '#3949AB', ...myStyle }}  to='/Finance'>Finance & Business</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Food' ? 'active' : ''}`} style={{ color: '#D81B60', ...myStyle }}  to='/Food'>Food & Recipes</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Education' ? 'active' : ''}`} style={{ color: '#FB8C00', ...myStyle }}  to='/Education'>Education & Learning</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Entertainment' ? 'active' : ''}`} style={{ color: '#5E35B1', ...myStyle }}  to='/Entertainment'>Entertainment & Culture</Link></li>
                        <li className="nav-item"><Link className={`nav-link ${location.pathname === '/Spiritual' ? 'active' : ''}`} style={{ color: '#00897B', ...myStyle }}  to='/Spiritual'>Spiritual</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
