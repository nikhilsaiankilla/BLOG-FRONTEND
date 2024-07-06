import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({ category }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/v1/api/posts?category=${category}`);
                setPosts(res?.data?.reverse());
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [category]);

    return (
        <div className="menu">
            <h1>Other posts you may like</h1>
            {posts.map((post) => (
                <div className="post" key={post.id}>
                    <img src={post?.image} alt="" />
                    <Link className="link" to={`/post/${post.id}`}>
                        <h1>{post.title}</h1>
                    </Link>
                    <Link className="link" to={`/post/${post.id}`}>
                        <button>Read More</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Menu;