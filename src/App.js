import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Books from "./pages/Books"
import Categories from "./pages/Categories";
import Issuances from "./pages/Issuances";
import Users from "./pages/Users";
import UserHistory from "./pages/userHistory";
import ProtectedRoutes from "./route/protectedRoutes";
import UserPage from "./pages/userPage";
import BookHistory from "./pages/bookHistory";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route exact path="/" element={<Login />} />

          {/* Admin-only Routes */}
          <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
            <Route exact path="/dashboard" element={<DashBoard />} />
            <Route exact path="/books" element={<Books />} />
            <Route exact path="/issuances" element={<Issuances />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/categories" element={<Categories />} /> 
            <Route exact path="/user-history/:userId" element={<UserHistory />} />
            <Route path="/bookHistory/:bookId" element={<BookHistory />} />

          </Route>

          {/* User-only Route */}
          <Route element={<ProtectedRoutes allowedRoles={['user']} />}>
            <Route exact path="/userPage" element={<UserPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
