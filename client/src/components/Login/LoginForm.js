import React, { useState, Fragment, useContext, createContext } from "react";
import './Login.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

function LoginForm() {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [isLogin, setLogin] = useState(false)

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(`/auth/login`, { email, password })
            const userID= createContext(response.data.user_id);
            setCookie('UserId', response.data.user_id)
            setCookie('AuthToken', response.data.token)

            const success = response.status === 200
            setLogin(true)
            if (success) navigate ('/dashboard') 


            window.location.reload()

        } catch (error) {
            setError(error.response.data)
            console.log(error.response.data)
        }

    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit}>
                <div className="form-inner">
                    <h1>Log in</h1>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password"
                            name="password"
                            id="password"
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <p>{error}</p>
                    <input type="submit" value="SUBMIT"/>
                </div>
            </form>
        </Fragment>
    )
}


export default LoginForm