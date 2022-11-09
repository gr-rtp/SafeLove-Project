import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from './Button';
import {useCookies} from "react-cookie"
import { useNavigate } from 'react-router-dom'


function Navbar({setLogIn, isLogin}){
    const [click, setClick] =useState(false);
    const [button, setButton]=useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const authToken = cookies.AuthToken

    let navigate = useNavigate()

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);  

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };
    window.addEventListener('resize',showButton);


    const handleClick_Logout = () => {
        
        if (!isLogin && authToken) {
            removeCookie('UserId', cookies.UserId);
            removeCookie('AuthToken', cookies.AuthToken);
            navigate ('/');
        }
    }

    return (
        <>
            <nav className='navbar'>
                <div className='navbar-container'>
                    <Link to={isLogin? '/': '/dashboard'} className='navbar-logo'>SAFELOVE
                    </Link>
                    {!isLogin && 
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    }
                    {!isLogin && 
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to={isLogin? '/': '/dashboard'} className='nav-links' onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/map' className='nav-links' onClick={closeMobileMenu} >
                                MapLoader
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/chat' className='nav-links' onClick={closeMobileMenu} >
                                Message
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/view-dates' className='nav-links' onClick={closeMobileMenu}>
                                My Dates
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/test-positive' className='nav-links' onClick={closeMobileMenu}>
                                Tested Positive
                            </Link>
                        </li>
                    </ul>
                    }    
                    {button && isLogin && <Button buttonStyle='btn--outline' link='login'>{'LOG IN'}</Button>}
                    {button && !isLogin && (<button className='btn--outline' onClick={handleClick_Logout}>Log Out</button>
                    )}           
                </div>
            </nav>
        </>
    );
}

export default Navbar;