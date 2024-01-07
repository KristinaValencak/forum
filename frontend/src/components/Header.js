import React from 'react'
import Logo from '../Assets/Logo.png'
import '../Styles/Header.css'
import {FaBars, FaTimes} from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import Logout from '../Logout';
import { FaUserCircle } from 'react-icons/fa';


function Header() {

  const [username, setUsername] = useState('');

    
    useEffect(() => {
        const loggedInUser = localStorage.getItem('username');
        if (loggedInUser) {
            setUsername(loggedInUser);
        }
    }, []);

    const handleLogout = () => {
      Logout(); 
      setUsername(''); 
      
  };

    const navRef = useRef();
    const showNawbar = () => {
      navRef.current.classList.toggle("responsive_nav");
    }

  return (
    <header>
    
      <a className='Logo' href='/home'><img src= {Logo} width={300} alt='logo'/></a>
    

      <nav ref={navRef}>
        <a className='homeHidden' href='/home'>Home</a>
        <a href='/forum'>Forum</a>
        <a href='/about'>About</a>
        <a href='/contact'>Contact</a>
        <a href='/quiz'>Quiz</a>
        <a className='login-Signup-hidden' href='/login'>Log in</a>
        <a className='login-Signup-hidden' href='/signup'>Sign up</a>
        
        <button className='nav-btn nav-close-btn' onClick={showNawbar}><FaTimes /></button>
      </nav>
    
    <div className='loginSignup'>
    {username ? (
                    <>
                    <FaUserCircle className="user-icon" /> 
                        <span>{username}</span>
                        <button onClick={handleLogout}>Log out</button>
                    </>
                ) : (
                    <>
                        <a href='/login'><button>Log in</button></a>
                        <a href='/signup'><button>Sign up</button></a>
                    </>
                )}
                </div>
    <div>
      <button className='nav-btn' onClick={showNawbar}><FaBars /></button>
    </div>
    </header>
  )
}

export default Header
