import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Books from "./pages/books"
import Categories from "./pages/categories";
import Issuances from "./pages/issuances";
import Users from "./pages/users";
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
          <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/books" element={<Books />} />
            <Route exact path="/issuances" element={<Issuances />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/categories" element={<Categories />} /> 
            <Route exact path="/user-history/:userId" element={<UserHistory />} />
            <Route path="/bookHistory/:bookId" element={<BookHistory />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Route>

          <Route element={<ProtectedRoutes allowedRoles={['user']} />}>
            <Route exact path="/userPage" element={<UserPage />} />
            <Route path="*" element={<Navigate to="/userPage" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
