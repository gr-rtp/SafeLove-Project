import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

import './Signup.css';


function SignupForm() {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(null)

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (password !== confirmPassword) {
                setError('Passwords need to match!')
                return
            }

            const response = await axios.post(`/auth/signup`, { email, password, confirmPassword })

            setCookie('UserId', response.data.user_id)
            setCookie('AuthToken', response.data.token)

            const success = response.status === 200
            // if (success)  navigate ('/register') 
            if (success) {
                console.log("Sign up successfully!")
                navigate ('/register')
            }

            window.location.reload()

        } catch (error) {
            setError(error.response.data)
            console.log(error.response.data)
        }

    }


    return (
        <form onSubmit={handleSubmit}>
            <div className="form-inner">
                <h1>Create account</h1>
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm password:</label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        id="confirmPassword"
                        required={true}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <p>{error}</p>
                <input type="submit" value="SUBMIT"/>
            </div>
        </form>
    )
}

export default SignupForm