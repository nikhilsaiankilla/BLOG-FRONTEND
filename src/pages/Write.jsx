import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/authContext";

import { toast } from 'react-toastify';
import { BASE_URL } from "../App";

const Write = () => {
    const state = useLocation().state;
    const [title, setTitle] = useState(state?.title || "");
    const [value, setValue] = useState(state?.desc || "");
    const [cat, setCat] = useState(state?.category || "");
    const [file, setFile] = useState(state?.image || null);

    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate()

    const handleClick = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            window.alert("please login to upload the post");
            return navigate('/login')
        }

        if (!title || !value || !cat || !file) {
            toast.warning("required all fields")
        } else {
            try {
                state
                    ? await axios.put(`${BASE_URL}/posts/update/${state.id}`, {
                        title: title,
                        desc: value,
                        category: cat,
                        image: file,
                        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    }, {
                        headers: {
                            Authorization: `Bearer ${currentUser?.token}`,
                        }
                    })
                    : await axios.post(`${BASE_URL}/posts/upload`, {
                        title: title,
                        desc: value,
                        category: cat,
                        image: file,
                        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    }, {
                        headers: {
                            Authorization: `Bearer ${currentUser?.token}`,
                        }
                    });
                navigate("/")
                toast.success("post uploaded successfully")
            } catch (err) {
                console.log(err);
                toast.error("sonething went wrong please try again")
            }
        }
    };

    return (
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="paste the image link"
                    value={file} onChange={(e) => setFile(e.target.value)}
                />
                <div className="editorContainer">
                    <ReactQuill
                        className="editor"
                        theme="snow"
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>
            <div className="menu">
                <div className="item">
                    <h1>Publish</h1>
                    <div className="image-container">
                        <img src={file ? file : "https://www.its.ac.id/tmesin/wp-content/uploads/sites/22/2022/07/no-image.png"} alt="" />
                    </div>
                    <div className="buttons">
                        <button>Save as a draft</button>
                        <button onClick={handleClick}>Publish</button>
                    </div>
                </div>
                <div className="item">
                    <h1>Category</h1>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "sports"}
                            name="cat"
                            value="sports"
                            id="sports"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="art">Sports</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "technology"}
                            name="cat"
                            value="technology"
                            id="technology"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="technology">Technology</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "cinema"}
                            name="cat"
                            value="cinema"
                            id="cinema"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="cinema">Cinema</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "design"}
                            name="cat"
                            value="design"
                            id="design"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="design">Design</label>
                    </div>
                    <div className="cat">
                        <input
                            type="radio"
                            checked={cat === "food"}
                            name="cat"
                            value="food"
                            id="food"
                            onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="food">Food</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Write;