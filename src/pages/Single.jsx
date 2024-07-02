import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

import axios from "axios";
import moment from "moment";

import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import Menu from "../components/Menu";


const Single = () => {
    const [post, setPost] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const postId = location.pathname.split("/")[2];
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/v1/api/posts/${postId}`);
                setPost(res.data[0]);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [postId]);

    const handleDelete = async () => {
        if (window.confirm("do you want to delete this post")) {
            try {
                const res = await axios.delete(`http://localhost:8000/v1/api/posts/delete/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${currentUser?.token}`,
                    },
                });
                if (res.status === 200) {
                    navigate("/");
                    return;
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="single">
            <div className="content">
                {post.image && <img src={post.image} alt="" />}
                <div className="user">
                    {post.userImg && <img src={post.userImg} alt="" />}
                    <div className="info">
                        <span>{post?.username}</span>
                        <p>Posted {moment(post?.date).fromNow()}</p>
                    </div>
                    {currentUser?.username === post?.username && (
                        <div className="edit">
                            <Link to={`/write?edit=2`} state={post}>
                                <img src={Edit} alt="" />
                            </Link>
                            <img onClick={handleDelete} src={Delete} alt="" />
                        </div>
                    )}
                </div>
                <h1>{post.title}</h1>
                <div
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.desc || '') }}
                    className="desc"
                />
            </div>
            <Menu category={post?.category} />
        </div>
    );
};

export default Single;
