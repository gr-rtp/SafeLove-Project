import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import {useCookies} from "react-cookie"

const STYLES = ['btn--primary', 'btn--outline', 'btn--test'];

const SIZES = ['btn--medium', 'btn--large'];

const LINKS = ['/login', '/signup'];

export const Button = ({
    children,
    type,
    onClick,
    buttonStyle,
    buttonSize,
    link,
    isLogin
}) => {

  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const authToken = cookies.AuthToken

  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  const checkLink = LINKS.includes(link) ? link : LINKS[0];


  return (
      <Link to={`${checkLink}`} className='btn-mobile'>
        <button
          className={`btn ${checkButtonStyle} ${checkButtonSize}`}
          type={type}
          disabled={isLogin}
        >
          {children}
        </button>
      </Link>
    );
};