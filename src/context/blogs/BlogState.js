import React, { useState } from 'react'
import BlogContext from './blogContext';

const BlogState = (props) => {
    const host = 'http://localhost:5000';

    const blogsInitial = []

    const [blogs, setBlogs] = useState(blogsInitial)

    //Fetch all blogs
    const getBlogs = async () => {
        //API call
        const response = await fetch(`${host}/api/blogs/fetchblogs`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const json = await response.json();
        setBlogs(Array.isArray(json) ? json : json.blogs || [])
    };

    //Add a blog
    const addBlog = async ( title, content, imageurl, category) => {
        //API call
        const response = await fetch(`${host}/api/blogs/createpvtblog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, content, imageurl, category }),
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
    const fetchAuthorBlogs = async (username) => {
        if (!username) {
            console.warn("fetchAuthorBlogs called with null or undefined username");
            return;
        }

        try {
            const response = await fetch(`${host}/api/blogs/authorblog/username/${username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const json = await response.json();
            setBlogs(Array.isArray(json) ? json : json.blogs || []);
        } catch (error) {
            console.error("Failed to fetch author blogs:", error);
            setBlogs([]);
        }
    };
    //Edit a blog
    const editBlog = async (id,title, content, imageurl, category) => {
        //API call
        const response = await fetch(`${host}/api/blogs/updateblog/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, content, imageurl, category }),
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
                newBlogs[index].category = category
                break;
            }

        }
        setBlogs(newBlogs);
    }

    //Fetching categorised Blogs
    const fetchCatBlogs= async(category)=>{
        const response = await fetch(`${host}/api/blogs/categoryblog/${category}`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const json = await response.json();
        setBlogs(Array.isArray(json) ? json : json.blogs || [])
    }

    return (
        <BlogContext.Provider value={{ blogs, getBlogs, addBlog, deleteBlog, getBlogById, fetchAuthorBlogs, editBlog ,fetchCatBlogs }}>
            {props.children}
        </BlogContext.Provider>
    )
}

export default BlogState

