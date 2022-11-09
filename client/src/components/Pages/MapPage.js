import React from 'react';
import '../../App.css';
import MapLoader from '../Map/MapLoader';
import Navbar from '../Navbar';

function MapPage (){
    
    return (
        <>
            <Navbar 
                isLogin={false}
            />
            <MapLoader />
        </>
    );
}

export default MapPage;