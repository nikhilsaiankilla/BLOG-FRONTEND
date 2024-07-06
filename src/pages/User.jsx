import { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import Dialog from '../components/Dialog'
import { AuthContext } from '../context/authContext'
import { getText, truncateText } from './Home';
import { BASE_URL } from '../App';

const User = () => {
    const [recoverInputs, setRecoverInputs] = useState({
        email: "",
        password: "",
        question: "",
    });

    const [accDeleteInputs, setAccDeleteInputs] = useState({
        email: "",
        password: "",
        reEnteredPassword: "",
    });

    const [changePassInputs, setChangePassInputs] = useState({
        email: "",
        oldPassword: "",
        newPassword: "",
    });

    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();

    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});

    const [isRecoverPassDialogOpen, setIsRecoverPassDialogOpen] = useState(false);

    const [isAccDeleteDialogOpen, setIsAccDeleteDialogOpen] = useState(false);

    const [isChangePassDialogOpen, setIsChangePassDialogOpen] = useState(false);

    useEffect(() => {
        const fetchPosts = async (id) => {
            try {
                const { data } = await axios.get(`${BASE_URL}/users/myPosts/${id}`);
                const postsArray = data?.data;
                setPosts(postsArray);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };

        const fetchUser = async (id) => {
            try {
                const { data } = await axios.get(`${BASE_URL}/users/getUser/${id}`);
                setUser(data?.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };

        if (id) {
            fetchPosts(id);
            fetchUser(id);
        }
    }, [id]);


    const handleRecoverInputs = (e) => {
        setRecoverInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAccDeleteInputs = (e) => {
        setAccDeleteInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangePassInputs = (e) => {
        setChangePassInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRecoverPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${BASE_URL}/auth/resetPassword`, recoverInputs, {
                headers: {
                    Authorization: `bearer ${currentUser?.token}`
                }
            })

            if (res.status === 200) {
                setIsRecoverPassDialogOpen(false);
                toast.success("password recovered successfully")
            }
        } catch (error) {
            toast.error("something went wrong")
        }
    }

    const handleChangePasswordController = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${BASE_URL}/auth/changePassword`, changePassInputs, {
                headers: {
                    Authorization: `bearer ${currentUser?.token}`
                }
            })
            console.log(res);

            if (res.status === 200) {
                setIsChangePassDialogOpen(false);
                toast.success("password changed successfully")
            }
        } catch (error) {
            const err = error?.response?.data?.message;
            toast.error(err)
        }
    }
    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`${BASE_URL}/auth/delete`, accDeleteInputs, {
                headers: {
                    Authorization: `bearer ${currentUser?.token}`
                }
            })

            console.log(res);
            setIsAccDeleteDialogOpen(false)
        } catch (error) {
            const err = error?.response?.data?.error + " please try again"
            toast.error(err)
        }
    }
    return (
        <>
            <Dialog isOpen={isRecoverPassDialogOpen} onClose={() => setIsRecoverPassDialogOpen(false)}>
                <h4 className='title'>reset Password</h4>
                <form>
                    <input type="email" name="email" id="email" placeholder='example@gmail.com' onChange={handleRecoverInputs} />
                    <input type="password" name="password" id="password" placeholder='enter new password' onChange={handleRecoverInputs} />
                    <input type="text" name="question" id="question" placeholder='enter recover question' onChange={handleRecoverInputs} />
                    <button type='submit' className='recover-btn' onClick={handleRecoverPassword}>recover password</button>
                    <button onClick={() => setIsRecoverPassDialogOpen(false)}>NO</button>
                </form>
            </Dialog>

            <Dialog isOpen={isAccDeleteDialogOpen} onClose={() => setIsAccDeleteDialogOpen(false)}>
                <h4 className='title'>do you want to delete your account?</h4>
                <form>
                    <input type="email" name="email" id="email" placeholder='example@gmail.com' onChange={handleAccDeleteInputs} />
                    <input type="password" name="password" id="password" placeholder='enter password' onChange={handleAccDeleteInputs} />
                    <input type="password" name="reEnteredPassword" id="reEnteredPassword" placeholder='enter password again' onChange={handleAccDeleteInputs} />
                </form>
                <div className='delete-btns'>
                    <button onClick={handleDeleteAccount}>YES</button>
                    <button onClick={() => setIsAccDeleteDialogOpen(false)}>NO</button>
                </div>
            </Dialog>

            <Dialog isOpen={isChangePassDialogOpen} onClose={() => setIsChangePassDialogOpen(false)}>
                <h4 className='title'>change password dialog</h4>
                <form>
                    <input type="email" name="email" id="email" placeholder='example@gmail.com' onChange={handleChangePassInputs} />
                    <input type="password" name="oldPassword" id="oldPassword" placeholder='enter old password' onChange={handleChangePassInputs} />
                    <input type="password" name="newPassword" id="newPassword" placeholder='enter new password' onChange={handleChangePassInputs} />
                </form>
                <div className='delete-btns'>
                    <button onClick={handleChangePasswordController}>change</button>
                    <button onClick={() => setIsChangePassDialogOpen(false)}>don't change</button>
                </div>
            </Dialog>
            <div className='profile'>
                <div className='profile-div'>
                    <div className='img'>
                        <img src={user?.userImg ? user?.userImg : "https://s3.eu-central-1.amazonaws.com/e-sathi/uploads/photos/2023/06/e-sathi_6be480f292b5bbe3b70fd267ef2ba580.jpg"} alt="" />
                    </div>
                    <div className='info'>
                        <ul className='info-div'>
                            <li>NAME : <span>{user?.username}</span></li>
                            <li>EMAIL : <span>{user?.email}</span></li>
                            <li>NUMBER OF POSTS : <span>{posts?.length}</span></li>
                        </ul>
                        {
                            currentUser?.id === user?.id && <div className='reset-password'>
                                <button onClick={() => setIsRecoverPassDialogOpen(true)}>forget password</button>
                                <button onClick={() => setIsChangePassDialogOpen(true)}>change password</button>
                                <button onClick={() => setIsAccDeleteDialogOpen(true)}>delete account</button>
                            </div>
                        }
                    </div>
                </div>
                <div className='blogs-div'>
                    <h1>YOUR BLOGS</h1>
                    <div className='blogs'>
                        {
                            posts?.length > 0
                                ?
                                posts?.map(post => (
                                    <div className="blog" key={post?.id}>
                                        <div className='blog-img'>
                                            <img src={`${post?.image ? post?.image : "https://www.georgeanimatrix.com/blog/wp-content/uploads/2023/12/illustration-photo-young-photographer_889227-1095.jpg"}`} alt="" />
                                        </div>
                                        <div className='blog-info'>
                                            <Link className="link" to={`/post/${post.id}`}>
                                                <h1>{truncateText(getText(post?.title), 70)}</h1>
                                            </Link>
                                            <p>{truncateText(getText(post?.desc), 80)}</p>
                                        </div>
                                    </div>
                                ))
                                :
                                <p>
                                    no posts available
                                </p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default User