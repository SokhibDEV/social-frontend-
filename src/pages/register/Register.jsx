import React, { useState } from "react";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hendleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    navigate('/login')

    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className='register'>
      <div className='card'>
        <div className='left'>
          <h1>Social App.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            ratione velit ipsa optio similique saepe neque at alias, eligendi
            cum!
          </p>
          <span>Do you have an accaunt?</span>
          <Link to={"/login"}>
            <button>Login</button>
          </Link>
        </div>
        <div className='right'>
          <h1>Register</h1>
          <form>
            <input
              type='text'
              placeholder='Username'
              name='username'
              onChange={handleChange}
            />
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={handleChange}
            />
            <input
              type='text'
              placeholder='Name'
              name='name'
              onChange={handleChange}
            />
            {err && err}
            <button onClick={hendleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};
