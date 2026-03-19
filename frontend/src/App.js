import React from 'react'
import './App.css';
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Home from './pages/Home'
import About from './pages/About'
import Forum from './pages/Forum'
import Contact from './pages/Contact'
import Thread from './pages/Thread';
import Quiz from './pages/Quiz';





function App() {
  return (
    <div>
    <BrowserRouter>
    <Routes>
      <Route index element = {<Home />} />
      <Route path='/home' element= {<Home/>}></Route>
      <Route path='/about' element= {<About/>}></Route>
      <Route path='/forum' element= {<Forum/>}></Route>
      <Route path='/contact' element= {<Contact/>}></Route>
      <Route path='/login' element= {<Login />}></Route>
      <Route path='/signup' element= {<Signup />}></Route>
      <Route path="/thread/:thread_id" element={<Thread />}></Route>
      <Route path='/quiz' element= {<Quiz />}></Route>
     
    </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
