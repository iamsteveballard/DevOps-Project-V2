import React, { useState, createContext, useEffect } from "react"
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js"
import UserPool from "../UserPool"

const AccountContext = createContext()

const Account = (props) => {


    const [loggedIn, setLoggedIn] = useState(false)
    const [jwtToken, setjwtToken] = useState("")
    const [username, setUsername] = useState("")
    const [message, setMessage] = useState("")
    const [signup, setSignup] = useState(false)
    const [confirm, setConfirm] = useState(false)

    useEffect( () => {
        getSession().catch(() => {
            setLoggedIn(false)
        })
    }, [loggedIn])

    const getSession = async () => {
        return await new Promise((resolve, reject) => {
            const user = UserPool.getCurrentUser()
            if (user) {
                user.getSession((err, session) => {
                    if (err) {
                        reject()
                    }else {
                        setjwtToken(session.idToken.jwtToken)
                        setUsername(session.idToken.payload['cognito:username'])
                        setLoggedIn(true)
                        resolve(session)
                    }
                })
            } else {
                reject()
            }
        })        
    }

    const authenticate = async (Username, Password) => {
        return await new Promise ((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool: UserPool,
            })
    
            const authDetails = new AuthenticationDetails({
                Username,
                Password,
            })
    
            user.authenticateUser(authDetails, {
                onSuccess: (data) => {
                    setLoggedIn(true)
                    setMessage("Logged in")
                    resolve(data)
                },
                onFailure: (err) => {
                    console.error("onFailure: ", err)
                    if (err.toString() === "UserNotConfirmedException: User is not confirmed.") {
                        setSignup(true)
                        setConfirm(true)
                    }
                    setMessage(err.toString())
                    reject(err)
                },
                newPasswordRequired: (data) => {
                    setMessage("New Password Required:", data)
                    resolve(data)
                },
            })
        })

    }
    const confirmSignup = async (Username, Code) => {
        return await new Promise ((resolve, reject) => {
            const user = new CognitoUser({
                Username,
                Pool: UserPool,
            })
            
            user.confirmRegistration(Code, true, (err, result) =>{
                if (err) {
                    console.log(err)
                    setMessage(err.toString())
                    reject(err)
                }
                setMessage(result.toString())
                resolve(true)
            } )
        })

    }

    const logout = () => {
        const user = UserPool.getCurrentUser()
        if (user) {
            user.signOut()
            setLoggedIn(false)
            setMessage("")
            setjwtToken("")
            setSignup(false)
            setConfirm(false)
        }
    }
    return (
        <AccountContext.Provider value = {{ authenticate,
                                            confirmSignup, 
                                            getSession, 
                                            logout, 
                                            loggedIn, 
                                            jwtToken, 
                                            username, 
                                            message, 
                                            setMessage,
                                            signup,
                                            setSignup,
                                            confirm,
                                            setConfirm }}>
            {props.children}
        </AccountContext.Provider>
    )
    
}
export { Account, AccountContext };