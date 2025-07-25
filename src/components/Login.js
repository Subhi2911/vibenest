import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = (props) => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        props.setprogress(0);
        e.preventDefault();
        props.setprogress(30);
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            
        });
        props.setprogress(70)
        const json = await response.json();

        if (json.success) {
            //save the token and resirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged in Successfully!! ","success" )
            navigate('/');
            props.setprogress(100)

        }
        else {
            props.showAlert(json.error,"danger" )
            props.setprogress(100);
        }
    }

    return (
        <div style={{ marginTop: '1rem' }}>
            <div className='container'>
                <h2>Login to continue..</h2>
            </div>
            <div className='container my-4' >
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwors" className="form-label">Password</label>
                        <input type="password" className="form-control" name='password' onChange={onChange} id="password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <p className='mx-1 my-3'>Don't have an account? Create new <Link className="btn btn-outline-success mx-3 my-1" to='/signup' type="submit">Signup</Link></p>
            </div>
        </div>
    )
}

export default Login
