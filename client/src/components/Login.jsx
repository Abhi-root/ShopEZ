import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  }

  return (
    <div className="auth-card-wrapper">
      <form className="authForm" onSubmit={handleLogin}>
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to continue your shopping journey</p>
        </div>

        <div className="form-floating mb-3 authFormInputs">
          <input
            type="email"
            className="form-control modern-input"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email address</label>
        </div>

        <div className="form-floating mb-4 authFormInputs">
          <input
            type="password"
            className="form-control modern-input"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className="auth-submit-btn">Sign In</button>

        <div className="auth-footer">
          <p>New to ShopEZ? <span onClick={() => setIsLogin(false)}>Create Account</span></p>
        </div>
      </form>
    </div>
  );
}

export default Login;