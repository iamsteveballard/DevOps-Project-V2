import React, { useContext } from "react"
import { AccountContext } from "./Account"
import Signup from "./Signup"
import Login from "./Login"



const Status = () => {

    const { logout, loggedIn, username, signup, setSignup, setConfirm, setMessage } = useContext(AccountContext)

    return (
        <div> 
            {loggedIn ? <div><div>Welcome {username}!</div><div><button onClick = {logout}>Logout</button></div></div>
            : <div>
                {signup ? 
                    <div>
                        <Signup />
                        <button onClick = {()=>{
                            setSignup(false)
                            setConfirm(false)                            
                            setMessage("")
                            }}>Login</button>   
                    </div> 
                    : 
                    <div>
                        <Login />
                        <button onClick = {()=>{
                            setSignup(true)
                            setMessage("")
                            }}>Signup</button>   
                    </div>}                            
              </div>            
            } 
            
        </div>
    )
}

export default Status;