import { useContext } from "react"
import { AuthContext } from "../context/authContext"

const Test = () => {

    const { currentUser } = useContext(AuthContext)
    return (
        <div className="test">
            <h1>Login success</h1>
            <div>
                <h4>email : {currentUser?.email}</h4>
                <h3>username : {currentUser?.username}</h3>
            </div>
        </div>
    )
}

export default Test