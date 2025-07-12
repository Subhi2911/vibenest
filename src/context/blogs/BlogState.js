import React, { useState } from 'react'
import BlogContext from './blogContext';

const BlogState = (props) => {
    const host= 'http://localhost:5000';

    const blogsInitial=[]

    const [blogs, setBlogs]=useState(blogsInitial)

    //Fetch all blogs
    const getBlogs= async()=>{
        //API call
        const response = await fetch (`${host}/api/blogs/fetchblogs`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json"
            },
        });
        const json = await response.json();
        setBlogs(Array.isArray(json)?json:json.blogs || [])
    };

    //Add a blog
    const addBlog = async(imageurl,title,content) =>{
        //API call
        const response = await fetch(`${host}/api/blogs/createpvtblog`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({imageurl, title,content }),
        // …
        
        });
        const blog = await response.json();
        
        setBlogs(blogs.concat(blog));
        
    }

    //get notes by id 
    const fetchMyBlogs= async(id)=>{
        const response= await fetch (`${host}/api/blogs//api/blogs/getblog/${id}`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });
        const json = await response.json();
        setBlogs(Array.isArray(json)?json:json.blogs||[])
    }

    //Delete a note
    const deleteBlog = async(id) =>{
        // eslint-disable-next-line no-unused-vars
        const response = await fetch(`${host}/api/blogs/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            
        });
        const newBlogs = blogs.filter((blog)=>{
           return blog.author?._id!==id
        })
        setBlogs(newBlogs)
    }

    return (
        <BlogContext.Provider value={{blogs,getBlogs, addBlog, deleteBlog, fetchMyBlogs}}>
         {props.children}
        </BlogContext.Provider>
    )
}

export default BlogState

