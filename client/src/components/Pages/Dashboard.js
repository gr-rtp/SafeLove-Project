import React from 'react';
import MatchingDashboard from '../Matching/MatchingDashboard'
import Navbar from '../Navbar';
import {useCookies} from 'react-cookie';

function Dashboard (){
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
   
    return (
        <div className='dashboard'>
            <Navbar 
                isLogin={false}
            />
            <MatchingDashboard />
        </div>
        
    );
}

export default Dashboard;