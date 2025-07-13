import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line no-unused-vars
const categories = [
  'Technology',
  'Health & Wellness',
  'Travel & Adventure',
  'Lifestyle',
  'Finance & Business',
  'Food & Recipes',
  'Education & Learning',
  'Entertainment & Culture',
  'Spiritual'
];

export default function CategoryNavbar() {
  return (
    <nav class="navbar navbar-expand-lg " style={{backgroundColor:'rgba(199,201,203,1'}}>
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/technology'>Technology</Link></li>
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/health'>Health & Wellness</Link></li>
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/travel'>Travel & Adventure</Link></li>
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/lifestyle'>Lifestyle</Link></li>
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/finance'>Finance & Business</Link></li>
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/food'>Food & Recipes</Link></li>
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/education'>Education & Learning</Link></li>
        <li class="nav-item"><Link class="nav-link active" aria-current="page" to='/spiritual'>Spiritual</Link></li>
        
      </ul>
      
    </div>
  </div>
</nav>
)
}