import React, { useState, useContext } from "react"
import UserPool from "../UserPool"
import { AccountContext } from "./Account"
import { CognitoUserAttribute } from "amazon-cognito-identity-js";


const Signup = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [code, setCode] = useState("")
    const attributeEmail = new CognitoUserAttribute({ Name : 'email', Value : email });
    const attributeName = new CognitoUserAttribute({ Name : 'name', Value : username });

    const { loggedIn, message, setMessage, setSignup, confirmSignup, confirm, setConfirm } = useContext(AccountContext)
    
    const onSubmit = (event) => {
        event.preventDefault()

        UserPool.signUp(username, password, [attributeEmail, attributeName], null, (err, data) => {
            if (err) {
                console.error(err)
                setMessage(err.toString())
            } else {
                setConfirm(true)                                
                setMessage("Sign up success, please verify your email")
            }            
        })
    }

    const onSubmitCode = (event) => {
        event.preventDefault()
        if (confirmSignup(username, code)) {
            setSignup(false)
        }
    }

    return (
        <div>
            {!loggedIn && 
                <div>
                    {!confirm ?
                        <form onSubmit={onSubmit}>
                            <label htmlFor="name">Username</label>
                            <input
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            ></input>
                            <label htmlFor="email">Email</label>
                            <input
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            ></input>
                            <label htmlFor="password">Password</label>
                            <input type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            ></input>

                            <button type="submit">Signup</button>
                            <div>{message}</div>
                        </form>
                    : 
                        <div>
                            <div>{message}</div>                
                            <div>---------------------</div>   
                            <label htmlFor="name">Confirm User: </label>
                            <div>
                                <input
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                ></input>
                            </div>
                            <form onSubmit={onSubmitCode}>
                                <label htmlFor="code">Confirmation Code</label>
                                <div>
                                <input
                                    value={code}
                                    onChange={(event) => setCode(event.target.value)}
                                ></input>
                                <button type="submit">Confirm</button>
                                </div>
                            </form>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Signup;