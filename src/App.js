import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoard from "./Pages/DashBoard";
import Login from "./Pages/Login";
import Books from "./Pages/Books";
import Issuances from "./Pages/Issuances";
import Users from "./Pages/Users";
import Header from "./Components/Header"; // assuming you have a Header component
import SideNav from "./Components/SideNav"; // assuming you have a SideNav component

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* <Header />
        <SideNav />  */}
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/issuances" element={<Issuances />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
