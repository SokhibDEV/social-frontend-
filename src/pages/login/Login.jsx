import React, { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
export const Login = () => {

  const { login } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",   
  });

  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e)=>{
  e.preventDefault()
    try {
     await login (inputs)
    navigate('/')
    } catch (err) {
    setErr(err.response.data)
    }
  }
  return (
    <div className='login'>
      <div className='card'>
        <div className='left'>
          <h1>Social App.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            ratione velit ipsa optio similique saepe neque at alias, eligendi
            cum!
          </p>
          <span>Don't you have an accaunt?</span>
          <Link to={'/register'} >
            <button>Register</button>
          </Link>
        </div>
        <div className='right'>
          <h1>Login</h1>
          <form>
            <input type='text' placeholder='Username' name="username" onChange={handleChange} />
            <input type='password' placeholder='Password' name="password" onChange={handleChange} />
            <button onClick={ handleLogin }>Login</button>
            { err && err }
          </form>
        </div>
      </div>
    </div>
  );
};
