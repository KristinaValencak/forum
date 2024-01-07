import React, { useState } from 'react'
import Header from './components/Header'
import './Styles/Login.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate();
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit =(event) => {
        event.preventDefault();
          axios.post('http://localhost:8081/login', values)
          .then(res =>{
            if(res.data != null) {
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('username', res.data.username);
              navigate('/home');
            } else {
              alert("No record existed");
            }
          })
          .catch(err => console.log(err));
    }
  return (
    <div>
    < Header />
    <div className='containerLogin'>
      <div className='bgBlack'>
      <h1>Sign<span> in</span></h1>
        <form action='' onSubmit={handleSubmit}>
            <div className='labelEmail'>
                <label htmlFor='email'><strong>Email</strong></label>
                <input type='email' placeholder='Enter email' name='email'
                onChange={handleInput} />
            </div>
            <div className='labelPassword'>
                <label htmlFor='password'><strong>Password</strong></label>
                <input type='password' placeholder='Enter Password' name='password'
                onChange={handleInput} />
            </div>
            <button type='submit'>Log in</button>
            <p></p>
            <Link to='/signup'><button>Create Account</button></Link>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Login
