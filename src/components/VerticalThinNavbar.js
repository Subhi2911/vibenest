import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function VerticalThinNavbar() {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const links = [
        { to: "/", icon: <i className="fa-solid fa-house mx-3"></i>, Label: "Home" },
        { to: "/myblogs", icon: <i className="fa-solid fa-file mx-3"></i>, label: "MyBlogs" },
        { to: "/profile", icon: <i className="fa-solid fa-user mx-3"></i>, label: "Profile" },
    ];

    if (!token) {
        links.push({
            to: "/login",
            icon: <i className="fa-solid fa-right-to-bracket mx-3"></i>,
            label: "Login",
        });
    }



    return (
        <nav
            style={{
                position: "fixed",
                top: "53px", // height of your horizontal navbar; adjust if needed
                left: 0,
                height: "calc(100vh - 56px)", // full height minus navbar
                width: "50px", // very thin width
                backgroundColor: "#f8f9fa",
                borderRight: "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "10px",
                zIndex: 1001,
            }}
            aria-label="Vertical navigation"
        >
            {links.map(({ to, icon, label }) => {
                const isActive = location.pathname === to;
                return (
                    <Link
                        key={to}
                        to={to}
                        title={label}
                        style={{
                            color: isActive ? "#0d6efd" : "#333",
                            margin: "25px 0",
                            fontSize: "1.5rem",
                            textDecoration: "none",
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        {icon}
                    </Link>
                );
            })}
        </nav>
    );
}
