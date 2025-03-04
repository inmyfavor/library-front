import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import LibraryApp from './LibraryApp.jsx';
import Auth from './Auth.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LibraryApp />} />
        <Route path="/login" element={<Auth />} />
      </Routes>
    </Router>
  </React.StrictMode>
);