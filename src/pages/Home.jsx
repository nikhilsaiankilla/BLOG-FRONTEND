import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const category = useLocation().search

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/v1/api/posts${category}`);
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [category]);

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    const handleNavigation = (dest) => {
        navigate(dest);
    }

    return (
        <div className="home">
            <div className="posts">
                {posts.map((post) => (
                    <div className="post" key={post.id}>
                        <div className="img">
                            <img src={post.image} alt="" />
                        </div>
                        <div className="content">
                            <Link className="link" to={`/post/${post.id}`}>
                                <h1>{post.title}</h1>
                            </Link>
                            <p>{getText(post.desc)}</p>
                            <button onClick={() => handleNavigation(`/post/${post.id}`)}>Read More</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;