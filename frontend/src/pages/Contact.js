import React from 'react'
import Header from '../components/Header'
import '../Styles/Contact.css'
import { useState } from 'react'
import axios from 'axios'


function Contact() {

  const [data, setData] = useState({name: "", email: "", message: ""});
  const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setData({...data, [name]: value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8081/send-email', data);
      console.log('Email sent successfully');
      
      setData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  

  return (
    <div className='containerContact'>
    < Header/>
    <form className='formContact' method='post' onSubmit={handleSubmit}>
      <h1>Contact<span> Here</span></h1>
      <input type='text' name='name' id='' onChange={handleChange} value={data.name} placeholder='Enter name' />
      <input type='email' name='email' id='' onChange={handleChange} value={data.email} placeholder='Enter email' />
      <textarea name='message' id='' cols='30' onChange={handleChange} value={data.message} rows= '8' placeholder='Type here...' />
      <button type='submit'>Send</button>
      
    </form>
    
    </div>
  )
}

export default Contact
