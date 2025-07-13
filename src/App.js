import './App.css';
import Blogs from './components/Blogs';
import Navbar from './components/Navbar';
import BlogState from './context/blogs/BlogState';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddBlog from './components/AddBlog'
import Notify from './components/Notify';
import Signup from './components/Signup';
import Read from './components/Read';
import Login from './components/Login';
import Profile from './components/Profile';
import MyBlogs from './components/MyBlogs';

function App() {
  
  return (
    <div >
      <BrowserRouter>
        <BlogState>
          <Navbar/>
          <Routes>
            <Route path='/' element ={<Blogs/>}/>
            <Route path='/addBlog' element={<AddBlog />}/>
            <Route path='/notofication' element={<Notify/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/read/:id' element={<Read/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/profile' element={<Profile/>}/> 
            <Route path='/myblogs' element={<MyBlogs/>}/>
          </Routes>
        </BlogState>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
