import React, { useContext, useState } from "react"
import { AccountContext } from "./Account"


const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { authenticate, loggedIn, message } = useContext(AccountContext)

    const onSubmit = (event) => {
        event.preventDefault()
        authenticate(email, password)
            .then(data => {
                // console.log("logged in", data)
            })
            .catch(err => {
                console.error("Log in Failed", err)
            })
    }
    return (
        <div>
            {!loggedIn && (
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email">Username or Email</label>
                        <div>
                            <input
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <div>
                            <input type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div>{message}</div>
                <button type="submit">Login</button>
                </form>
            )}
        </div>
    )
}

export default Login;