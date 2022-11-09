import React from 'react';
import '../../App.css';
import HeroSection from '../HeroSection'
import Navbar from '../Navbar';

function Home (){
    
    return (
        <>  
            <Navbar 
                isLogin={true}
            />
            <HeroSection />
        </>
    );
}

export default Home;