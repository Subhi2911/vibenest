import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const host = 'http://localhost:5000';

    let navigate = useNavigate(); 
    const [credentials, setCredentials] = useState({ username: '', email: '', password: '', cpassword: '' })
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.cpassword) {
            //props.showAlert("Passwords do not match", "danger");
            return;
        }

        try {
            const response = await fetch(`${host}/api/auth/createuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: credentials.username,
                    email: credentials.email,
                    password: credentials.password
                }),
            });

            let json = {};
            const text = await response.text(); // first get raw text
            try {
                json = JSON.parse(text); // try to parse JSON
            } catch (err) {
                console.warn("Could not parse JSON:", text);
            }
            if (response.ok && json.success) {
                localStorage.setItem("token", json.authToken);


                navigate("/");
                props.showAlert("Account Created Successfully!", "success");
            } else {
                //props.showAlert(json.error || "Signup failed", "danger");
            }
        } catch (err) {
            console.error("Network error:", err);
            //props.showAlert("Network error. Please try again later.", "danger");
        }
    };

return (
    <div>
        <div className='container'>
            <h2 style={{marginBottom:'2rem'}}>Create an account to continue</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="username" className="form-control" name='username' id="username" onChange={onChange} value={credentials.username} aria-describedby="usernameHelp" />

                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onChange}  value={credentials.email} aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} value={credentials.password} name='password' />
                    <div id="passwordHelp" className="form-text">Password mush be 8 characters long.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="cpassword" className="form-control" id="cpassword" onChange={onChange} value={credentials.cpassword} name='cpassword' />
                    <div id="passwordHelp" disabled={credentials.password!==credentials.cpassword} className="form-text">Password is not matching.</div>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
)
}

export default Signup

