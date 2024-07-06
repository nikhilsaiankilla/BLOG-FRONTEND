import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

import axios from "axios";
import moment from "moment";

import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import Menu from "../components/Menu";

import { toast } from 'react-toastify';
import Dialog from './../components/Dialog'
import { BASE_URL } from "../App";

const Single = () => {
    const [post, setPost] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const postId = location.pathname.split("/")[2];
    const { currentUser } = useContext(AuthContext);

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/posts/${postId}`);
                setPost(res.data[0]);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [postId]);

    const handleDelete = async () => {
        try {
            console.log(currentUser?.token);
            const res = await axios.delete(`${BASE_URL}/posts/delete/${postId}`, {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`,
                },
            });
            if (res.status === 200) {
                navigate("/");
                toast.success("post deleted successfully")
                return;
            }
        } catch (err) {
            console.log(err);
            toast.error("sonething went wrong")
        }
    };

    return (
        <>
            <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <h4>Do you want to delete this post</h4>
                <div className="delete-btns">
                    <button onClick={handleDelete}>yes, delete it</button>
                    <button onClick={() => setIsDialogOpen(false)}>no don't delete</button>
                </div>
            </Dialog>
            <div className="single">
                <div className="content">
                    {post.image && <img src={post.image} alt="" />}
                    <div className="user">
                        {post.userImg && <img src={post.userImg} alt="" onClick={() => {
                            navigate(`/profile/${post?.uid}`)
                        }} />}
                        <div className="info">
                            <span onClick={() => {
                                navigate(`/profile/${post?.uid}`)
                            }}>{post?.username}</span>
                            <p>Posted {moment(post?.date).fromNow()}</p>
                        </div>
                        {currentUser?.username === post?.username && (
                            <div className="edit">
                                <Link to={`/write?edit=2`} state={post}>
                                    <img src={Edit} alt="" />
                                </Link>
                                <img onClick={() => setIsDialogOpen(true)} src={Delete} alt="" />
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
        </>
    );
};

export default Single;
