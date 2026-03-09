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

  // Search State: Ise hum searchQuery kahenge jo Products.jsx use karega
  const [searchQuery, setSearchQuery] = useState(''); 
  const [cartCount, setCartCount] = useState(0);

  // 🔒 Axios interceptor to always attach JWT if exists
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
        const response = await axios.get('https://shop-ez-flame.vercel.app/api/cart/fetch-cart');
        setCartCount(response.data.filter(item=> item.userId === userId).length);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    }
  }

  // Search handling logic
  const handleSearch = () =>{
    // Agar user home page par nahi hai, toh use home bhej dein search results ke liye
    navigate('/'); 
    // Scroll to products section if needed
    setTimeout(() => {
        window.scrollTo({top: 600, behavior: 'smooth'});
    }, 100);
  }

  // 🟢 LOGIN
  const login = async () => {
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      const loginInputs = { email: email.trim(), password: password };
      const res = await axios.post('https://shop-ez-flame.vercel.app/api/users/login', loginInputs);

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
      fetchCartCount(); // Login ke baad cart update karein
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!!");
    }
  };

  // 🟢 REGISTER
  const register = async () =>{
    const inputs = {username, email, usertype, password};
    try {
      const res = await axios.post('https://shop-ez-flame.vercel.app/api/users/register', inputs);

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

  // 🟢 LOGOUT
  const logout = () =>{
    localStorage.clear();
    setCartCount(0); // Cart clear karein UI mein
    setSearchQuery(''); // Search clear karein
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
        searchQuery, setSearchQuery, // Ab Products.jsx is 'searchQuery' ko access kar payega
        handleSearch,
        cartCount, setCartCount,
        fetchCartCount  
      }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider;