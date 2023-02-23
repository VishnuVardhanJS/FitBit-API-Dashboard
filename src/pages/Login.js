import React from 'react'
import '../App.css'
import logo from '../assets/images/Fitbit_Black.png'
import {useNavigate} from 'react-router-dom'

function Login() {
  const navigate = useNavigate();

  function timeout(time) {
    return new Promise( res => setTimeout(res, time) );
  }

  async function submitClick() {
      window.open('http://127.0.0.1:5000/auth', );
      await timeout(2000);
      navigate('/home')
    }


  return (
    <div className="Login">
      <img src={logo} className="App-logo" alt="logo" />

      <button className="login-button" onClick={submitClick}>
        Login with FitBit
      </button>

    </div>
  )
}

export default Login
