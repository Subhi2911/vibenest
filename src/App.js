import './App.css';
import Blogs from './components/Blogs';
import Navbar from './components/Navbar';
import BlogState from './context/blogs/BlogState';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddBlog from './components/AddBlog'
import Notify from './components/Notify';
import Signup from './components/Signup';
import Read from './components/Read';

function App() {
  
  return (
    <div >
      <BrowserRouter>
        <BlogState>
          <Navbar/>
          <Routes>
            <Route path='/' element ={<Blogs/>}/>
            <Route path='/addBlog' element={<AddBlog/>}/>
            <Route path='/notofication' element={<Notify/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/read' element={<Read/>}/>
          </Routes>
        </BlogState>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
