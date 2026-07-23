import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');


  const [searchQuery, setSearchQuery] = useState(''); 
  const [cartCount, setCartCount] = useState(0);

  
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(()=>{
    fetchCartCount();
  }, []);

  const fetchCartCount = async () =>{
    const userId = localStorage.getItem('userId');
    if(userId){
      try {
        await axios.get('https://shopez-2-6e3z.onrender.com/api/cart/fetch-cart');
        setCartCount(response.data.filter(item=> item.userId === userId).length);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    }
  }

  const handleSearch = () =>{
    
    navigate('/'); 
  
    setTimeout(() => {
        window.scrollTo({top: 600, behavior: 'smooth'});
    }, 100);
  }

 
  const login = async () => {
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      const loginInputs = { email: email.trim(), password: password };
      const res = await axios.post('https://shopez-2-6e3z.onrender.com/api/users/login', loginInputs);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('userType', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if (res.data.usertype === 'customer') {
        navigate('/');
      } else if (res.data.usertype === 'admin') {
        navigate('/admin');
      }
      fetchCartCount(); 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!!");
    }
  };


  const register = async () =>{
    const inputs = {username, email, usertype, password};
    try {
      const res = await axios.post('https://shopez-2-6e3z.onrender.com/api/users/register', inputs);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data._id);
      localStorage.setItem('userType', res.data.usertype);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if(res.data.usertype === 'customer'){
        navigate('/');
      } else if(res.data.usertype === 'admin'){
        navigate('/admin');
      }
    } catch (err) {
      alert("Registration failed!!");
      console.error(err.response?.data || err.message);
    }
  }


  const logout = () =>{
    localStorage.clear();
    setCartCount(0); 
    setSearchQuery(''); 
    navigate('/');
  }

  return (
    <GeneralContext.Provider 
      value={{
        login, register, logout,
        username, setUsername,
        email, setEmail,
        password, setPassword,
        usertype, setUsertype,
        searchQuery, setSearchQuery, 
        handleSearch,
        cartCount, setCartCount,
        fetchCartCount  
      }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider;