import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/')
    }
    return (
        <div className="navbar">
            <div className="container">
                <div className="logo">
                    <Link to="/">
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div className="links">
                    <Link className="link" to="/?category=cricket">
                        <h6>CRICKET</h6>
                    </Link>
                    <Link className="link" to="/?category=coding">
                        <h6>CODING</h6>
                    </Link>
                    <Link className="link" to="/?category=technology">
                        <h6>TECHNOLOGY</h6>
                    </Link>
                    <Link className="link" to="/?category=cinema">
                        <h6>CINEMA</h6>
                    </Link>
                    <Link className="link" to="/?category=design">
                        <h6>DESIGN</h6>
                    </Link>
                    <Link className="link" to="/?category=food">
                        <h6>FOOD</h6>
                    </Link>
                    <span>{currentUser?.username}</span>
                    {currentUser ? (
                        <span onClick={handleLogout}>Logout</span>
                    ) : (
                        <Link className="link" to="/login">
                            Login
                        </Link>
                    )}
                    <span className="write">
                        <Link className="link" to="/write">
                            Write
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;