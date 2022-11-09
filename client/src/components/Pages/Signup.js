import React from 'react';
import SignupForm from '../Signup/SignupForm';
import Navbar from '../Navbar';

function Signup (){
    return (  
        <>
            <Navbar 
                isLogin={true}
            />
            <SignupForm />
        </>
    );
}

export default Signup;