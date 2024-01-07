import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header'
import './Styles/Signup.css'

function Signup() {
  
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    //const [errors, setErrors] = useState({})
    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit =(event) => {
        event.preventDefault();
        
          axios.post('http://localhost:8081/signup', values)
          .then(res =>{
            navigate('/login');
          })
          .catch(err => console.log(err));
    }
  return (
    <div>
    < Header/>
    <div className='containerSignup'>
      <div className='signUp'>
      <h1>Sign<span> up</span></h1>
        <form action='' onSubmit={handleSubmit}>
        <div className='labelName'>
                <label htmlFor='name'><strong>Name</strong></label>
                <input type='text' placeholder='Enter name' name='name'
                 onChange={handleInput}/>
            </div>
            <div className='labelEmail'>
                <label htmlFor='email'><strong>Email</strong></label>
                <input type='email' placeholder='Enter email' name='email'
                 onChange={handleInput}/>
            </div>
            <div className='labelPassword'>
                <label htmlFor='password'><strong>Password</strong></label>
                <input type='password' placeholder='Enter Password' name='password'
                onChange={handleInput}/>
            </div>
            <p></p>
            <button type='submit'>Sign up</button>
            <p></p>
            <Link to= "/login"><button>Log in</button></Link>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Signup
