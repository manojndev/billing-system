import React, { useState } from 'react';
import './login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-page">
      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <h2>Sign In</h2>
            <input 
              type="text" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <span>Username</span>
            <i></i>
          </div>
          <div className="input-box">
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <span>Enter Password</span>
            <i></i>
          </div>
          <input type="submit" value="Login" />
          <div className="links">
            {/* <a href="#">Forgot Password?</a> */}
            {/* <a href="#">Sign Up</a> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;