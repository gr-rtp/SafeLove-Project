import React from 'react';
import LoginForm from '../Login/LoginForm';
import Navbar from '../Navbar';

function Login (){
    return (
        <>
            <Navbar 
                isLogin={true}
            />
            <LoginForm />
        </>
    );
}

export default Login;