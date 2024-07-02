import { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../context/authContext";
import axios from 'axios';
import { Link } from 'react-router-dom';
const User = () => {

    const { currentUser } = useContext(AuthContext)

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const fetchPosts = async (currentUser) => {
            const data = await axios.get(`http://localhost:8000/v1/api/users/myPosts/${currentUser}`)
            const postsArray = data?.data?.data;
            setPosts(postsArray)
            console.log(posts);
        }
        fetchPosts(currentUser?.id)
    }, [currentUser, posts])

    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + "....";
        }
        return text;
    };

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    return (
        <div className='profile'>
            <div className='profile-div'>
                <div className='img'>
                    <img src={currentUser?.userImg ? currentUser?.userImg : "https://s3.eu-central-1.amazonaws.com/e-sathi/uploads/photos/2023/06/e-sathi_6be480f292b5bbe3b70fd267ef2ba580.jpg"} alt="" />
                </div>
                <ul className='info'>
                    <li>NAME : <span>{currentUser?.username}</span></li>
                    <li>EMAIL : <span>{currentUser?.email}</span></li>
                    <li>NUMBER OF POSTS : <span>{posts?.length}</span></li>
                </ul>
            </div>
            <div className='blogs-div'>
                <h1>YOUR BLOGS</h1>

                <div className='blogs'>
                    {
                        posts?.length > 0 && <>
                            {
                                posts?.map(post => (<div className="blog">
                                    <div className='blog-img'>
                                        <img src={`${post?.image ? post?.image : "https://www.georgeanimatrix.com/blog/wp-content/uploads/2023/12/illustration-photo-young-photographer_889227-1095.jpg"}`} alt="" />
                                    </div>
                                    <div className='blog-info'>
                                        <Link className="link" to={`/post/${post.id}`}>
                                            <h1>{post.title}</h1>
                                        </Link>
                                        <p>{truncateText(getText(post?.desc), 100)}</p>
                                    </div>
                                </div>))
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default User