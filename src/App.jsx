import { useState } from 'react'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Auth from './components/Auth'
import './App.css'
import Footer from './components/Footer'

function App() {
 
const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
    <Navbar  setToken={setToken}/>   
    <div className="">
        {!token ? (
          // show login/register
          <Auth setToken={setToken} />
        ) : (
   <Manager/>
        )}
      </div>  
     <Footer/>
    </>
  );
}

export default App
