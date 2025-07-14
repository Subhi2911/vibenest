import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryNavbar() {
    let myStyle = {
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        fontWeight: '600',
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
                        <li className="nav-item"><Link style={{ color: '#1E88E5', ...myStyle }} className="nav-link active" to='/Technology'>Technology</Link></li>
                        <li className="nav-item"><Link style={{ color: '#43A047', ...myStyle }} className="nav-link active" to='/Health'>Health & Wellness</Link></li>
                        <li className="nav-item"><Link style={{ color: '#F4511E', ...myStyle }} className="nav-link active" to='/Travel'>Travel & Adventure</Link></li>
                        <li className="nav-item"><Link style={{ color: '#8E24AA', ...myStyle }} className="nav-link active" to='/Lifestyle'>Lifestyle</Link></li>
                        <li className="nav-item"><Link style={{ color: '#3949AB', ...myStyle }} className="nav-link active" to='/Finance'>Finance & Business</Link></li>
                        <li className="nav-item"><Link style={{ color: '#D81B60', ...myStyle }} className="nav-link active" to='/Food'>Food & Recipes</Link></li>
                        <li className="nav-item"><Link style={{ color: '#FB8C00', ...myStyle }} className="nav-link active" to='/Education'>Education & Learning</Link></li>
                        <li className="nav-item"><Link style={{ color: '#5E35B1', ...myStyle }} className="nav-link active" to='/Entertainment'>Entertainment & Culture</Link></li>
                        <li className="nav-item"><Link style={{ color: '#00897B', ...myStyle }} className="nav-link active" to='/Spiritual'>Spiritual</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
