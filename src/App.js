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
import AboutAuthor from './components/AboutAuthor';
import CategoryBlog from './components/CategoryBlog';
import LoadingBar from "react-top-loading-bar";
import { useContext, useEffect, useState } from 'react';
import BlogContext from './context/blogs/blogContext';
import Alert from './components/Alert';


function App() {
    const context = useContext(BlogContext);
    const { fetchNotifications } = context
    const [alert, setAlert] = useState(null);
    const showAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type
        })
        setTimeout(() => {
            setAlert(null);
        }, 1500)
    }

    useEffect(() => {
        const load = async () => {
            await fetchNotifications();
        };
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchNotifications]);
    const [progress, setProgress] = useState(0);
    const [color, setColor] = useState('red')

    const setprogress = (progress) => {
        setProgress(progress)
    }
    const loaderColor = (color) => {
        setColor(color);
    }

    const categories = {
        General: '#000000',
        Technology: '#1E88E5',
        Health: '#43A047',
        Travel: '#F4511E',
        Lifestyle: '#8E24AA',
        Love: '#DC2525',
        Finance: '#3949AB',
        Food: '#D81B60',
        Education: '#FB8C00',
        Entertainment: '#5E35B1',
        Spiritual: '#00897B'
    };
    return (
        <div >
            <BrowserRouter>
                <BlogState>
                    <Navbar />
                    <Alert alert={alert}/> 
                    <LoadingBar
                        height='3px'
                        color={color}
                        progress={progress}
                        onLoaderFinished={() => { setProgress(0) }}
                    />
                    <Routes>
                        <Route path='/' element={<Blogs showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/addBlog' element={<AddBlog showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/notifications' element={<Notify showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/signup' element={<Signup showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/read/:id' element={<Read showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/login' element={<Login showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/profile' element={<Profile showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/myblogs' element={<MyBlogs showAlert={showAlert} setprogress={setprogress} />} />
                        <Route path='/aboutauthor/:username' element={<AboutAuthor showAlert={showAlert} setprogress={setprogress} />} />
                        {Object.entries(categories).map(([path, color]) => (
                            <Route
                                key={path}
                                path={`/${path}`}
                                element={<CategoryBlog category={path} color={color} loaderColor={loaderColor} setprogress={setprogress} />}
                            />
                        ))}
                    </Routes>
                </BlogState>
            </BrowserRouter>

        </div>
    );
}

export default App;
