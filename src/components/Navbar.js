import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
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


                {/* Right - Create, Notification, Avatar */}
                <div
                    className="d-flex align-items-center ms-3"
                    style={{ flexShrink: 0, gap: '1rem' }}
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
                        style={{ textDecoration: 'none' ,fontSize: '1.5rem' }}
                    >
                        <i className="fa-solid fa-bell"></i>
                    </Link>

                    <div>
                        <Avatar width="2" height="2" size="16" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
