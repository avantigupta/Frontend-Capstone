import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoard from "./Pages/DashBoard";
import Login from "./Pages/Login";
import Books from "./Pages/Books";
import Issuances from "./Pages/Issuances";
import Users from "./Pages/Users";
import Categories from "./Pages/Categories";

function App() {
  return (
    <Router>
      <div className="app-container">
      
          <Routes>
            <Route exact path="/" element={ <Login />} />
            <Route exact path="/dashboard" element={<DashBoard />} />
            <Route exact path="/books" element={<Books />} />
            <Route exact path="/issuances" element={<Issuances />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/categories" element={<Categories />} /> 
            </Routes>
    
      </div>
    </Router>
  );
}

export default App;
