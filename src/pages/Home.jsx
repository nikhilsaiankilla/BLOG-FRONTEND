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
                setPosts(res?.data);
            } catch (err) {
                setPosts([])
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


    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + "...";
        }
        return text;
    };

    return (
        <div className="home">
            <div className="posts">
                {
                    posts?.length > 0 ? posts.map((post) => (
                        <div className="post" key={post.id}>
                            <div className="img">
                                <img src={post?.image} alt="" />
                            </div>
                            <div className="content">
                                <Link className="link" to={`/post/${post.id}`}>
                                    <h1>{post.title}</h1>
                                </Link>
                                <p>{truncateText(getText(post?.desc), 200)}</p>
                                <button onClick={() => handleNavigation(`/post/${post.id}`)}>Read More</button>
                            </div>
                        </div>
                    ))
                        :
                        <h3>no posts available</h3>}
            </div>
        </div>
    );
};

export default Home;