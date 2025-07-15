import React, { useState } from 'react'
import BlogContext from './blogContext';

const BlogState = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const blogsInitial = [];
    const initialNotify = [];

    const [blogs, setBlogs] = useState(blogsInitial)
    const [notification, setNotification] = useState(initialNotify)

    //Fetch all blogs
    const getBlogs = async (page = 1, limit = 6) => {
        try {
            const response = await fetch(`${host}/api/blogs/fetchblogs?page=${page}&limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const json = await response.json();
            return {
                blogs: Array.isArray(json.blogs) ? json.blogs : [],
                total: json.total || 0,
            };
        } catch (error) {
            console.error("Error fetching blogs:", error);
            return { blogs: [], total: 0 };
        }
    };


    //Add a blog
    const addBlog = async (title, content, imageurl, isprivate, category) => {
        //API call
        const response = await fetch(`${host}/api/blogs/createpvtblog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, content, imageurl, isprivate, category }),
            // …

        });
        const blog = await response.json();

        setBlogs(blogs.concat(blog));

    }

    //get blog by id 
    const getBlogById = async (id) => {
        try {
            const response = await fetch(`${host}/api/blogs/getblog/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const json = await response.json();
            return json;
        } catch (error) {
            console.error("Error fetching blog by ID:", error);
            return null;
        }
    };

    //Delete a note
    const deleteBlog = async (id) => {
        // eslint-disable-next-line no-unused-vars
        const response = await fetch(`${host}/api/blogs/deleteblog/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },

        });
        const newBlogs = blogs.filter((blog) => {
            return blog.author?._id !== id
        })
        setBlogs(newBlogs)
    }

    // Fetch blogs by author's username
    const fetchAuthorBlogs = async (username, page = 1, limit = 6) => {
        if (!username) return { blogs: [], total: 0 };

        try {
            const response = await fetch(`${host}/api/blogs/authorblog/username/${username}/?page=${page}&limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const json = await response.json();
            
            return {
                blogs: Array.isArray(json.blogs) ? json.blogs : [],
                total: json.total || 0,
            };
        } catch (error) {
            console.error("Failed to fetch author blogs:", error);
            return { blogs: [], total: 0 };
        }
    };


    //Edit a blog
    const editBlog = async (id, title, content, imageurl, isprivate, category) => {
        //API call
        const response = await fetch(`${host}/api/blogs/updateblog/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, content, imageurl, isprivate, category }),
            // …

        });
        // eslint-disable-next-line no-unused-vars
        const json = await response.json();
        let newBlogs = JSON.parse(JSON.stringify(blogs));


        for (let index = 0; index < blogs.length; index++) {
            const element = blogs[index];
            if (element._id === id) {
                newBlogs[index].title = title;
                newBlogs[index].content = content;
                newBlogs[index].imageurl = imageurl;
                newBlogs[index].isprivate = isprivate;
                newBlogs[index].category = category
                break;
            }

        }
        setBlogs(newBlogs);
    }

    //Fetching categorised Blogs with pagination support
    const fetchCatBlogs = async (category, page = 1, limit = 6) => {
        try {
            const response = await fetch(`${host}/api/blogs/categoryblog/${category}?page=${page}&limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const json = await response.json();
            // Assuming your backend returns { blogs: [...], total: number }
            return {
                blogs: Array.isArray(json.blogs) ? json.blogs : [],
                total: json.total || 0,
            };
        } catch (error) {
            console.error("Error fetching category blogs:", error);
            return { blogs: [], total: 0 };
        }
    }

    //Fetching notifications

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return; // don't proceed if no token

        try {
            const response = await fetch(`${host}/api/notifications/getnotifications`, {
                method: 'GET',
                headers: {
                    'auth-token': token,
                },
            });

            if (response.status === 401) {
                console.warn("Unauthorized: Invalid or expired token");
                return;
            }

            const data = await response.json();
            setNotification(data.notifications);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };



    return (
        <BlogContext.Provider value={{ blogs, getBlogs, addBlog, deleteBlog, getBlogById, fetchAuthorBlogs, editBlog, fetchCatBlogs, fetchNotifications, notification }}>
            {props.children}
        </BlogContext.Provider>
    )
}

export default BlogState

