import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import BlogState from './context/blogs/BlogState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BlogState>
            <App />
        </BlogState>
    </React.StrictMode>
);

reportWebVitals();
