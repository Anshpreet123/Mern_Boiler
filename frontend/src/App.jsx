// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import UserProfile from './components/UserProfile.jsx';
import BlogList from './components/BlogList.jsx';
import Blog from './components/Blog.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/blogs" component={BlogList} />
        <Route path="/blog/:blogId" component={Blog} />
      </Routes>
    </Router>
  );
}

export default App;