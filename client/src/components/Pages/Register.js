import React from 'react';
import RegisterForm from '../Signup/RegisterForm';
import Navbar from '../Navbar';

function Register (){
    return (
        <>
            <Navbar 
                isLogin={true}
            />
            <RegisterForm />
        </>
    );
}

export default Register;