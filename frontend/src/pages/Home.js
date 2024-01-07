import React from 'react'
import Header from '../components/Header'
import '../Styles/Home.css'
import Pets from '../Assets/Pets.png'



function Home() {


  return (
    <div>
      < Header />
      <div className='containerHome'>
      <h1>Welcome to the world of<br/> <span> Furry friends!</span></h1><br/>
      <p>If you need advice or want to share stories about your furry friends, then you're in the right place! <br/> Join our community and let's create a magical space together for all furry enthusiasts!</p><br/>
      <a  href='/forum'><button className='gotoforum'>Go to forum</button></a>
      <div>
        <img  className= 'imgPets' src= {Pets} alt='Profile' height={300}/>
      </div>
  
    </div>
    </div>
  )
}

export default Home
