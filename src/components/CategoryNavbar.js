import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryNavbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'rgb(180 184 187)' }}>
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link style={{ color: '#1E88E5', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/technology'>Technology</Link></li>
            <li className="nav-item"><Link style={{ color: '#43A047', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/health'>Health & Wellness</Link></li>
            <li className="nav-item"><Link style={{ color: '#F4511E', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/travel'>Travel & Adventure</Link></li>
            <li className="nav-item"><Link style={{ color: '#8E24AA', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/lifestyle'>Lifestyle</Link></li>
            <li className="nav-item"><Link style={{ color: '#3949AB', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/finance'>Finance & Business</Link></li>
            <li className="nav-item"><Link style={{ color: '#D81B60', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/food'>Food & Recipes</Link></li>
            <li className="nav-item"><Link style={{ color: '#FB8C00', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/education'>Education & Learning</Link></li>
            <li className="nav-item"><Link style={{ color: '#5E35B1', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/entertainment'>Entertainment & Culture</Link></li>
            <li className="nav-item"><Link style={{ color: '#00897B', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="nav-link active" to='/spiritual'>Spiritual</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
