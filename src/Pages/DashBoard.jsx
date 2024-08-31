import React, { useState, useEffect } from "react";
import "../Styles/Dashboard.css";
import book from "../Icons/book (1).png";
import users from "../Icons/user (1).png";
import category from "../Icons/menu.png";
import readers from "../Icons/reader.png";
import HocContainer from "../Components/HocContainer";
import { getCategoryCount } from "../api/service/category";
import { getBookCount } from "../api/service/books";

function Dashboard() {
  const [categoryCount, setCategoryCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  
  
  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const response = await getCategoryCount();
        setCategoryCount(response.data);
      } catch (error) {
        console.error("Error fetching category count:", error);
      }
    };

    fetchCategoryCount();
  }, []);

  useEffect(()=>{
    const fetchBookCount = async ()=>{
      try{
        const response = await getBookCount();
        setBookCount(response.data);

      }catch(error){
        console.log("error fetching book count:", error);
      }
    };
    fetchBookCount();
  }, []);


  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-welcome-section">
        <div className="welcome-box">
          <h2>Hi, Admin!</h2>
          <p>Let's dive into today's library operations and ensure everything is in order!</p>
        </div>
      </div>
      <div className="dashboard-container">
        <div className="card-row">
          <div className="dashboard-card">
            <img src={book} alt="" className="dashboard-icons" />
            <h3>{bookCount} Total books</h3>
          </div>
          <div className="dashboard-card">
            <img src={users} alt="" className="dashboard-icons" />
            <h3>100+ Users</h3>
          </div>
          <div className="dashboard-card">
            <img src={readers} alt="" className="dashboard-icons" />
            <h3>50 Active Readers</h3>
          </div>
        </div>
        <div className="card-row">
          <div className="dashboard-card">
            <img src={category} alt="" className="dashboard-icons" />
            <h3>{categoryCount} Categories</h3>
          </div>
          <div className="dashboard-card">
            <img src={readers} alt="" className="dashboard-icons" />
            <h3>20 In House Users</h3>
          </div>
          <div className="dashboard-card">
            <img src={readers} alt="" className="dashboard-icons" />
            <h3>10 Takeaway Readers</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HocContainer(Dashboard, "Dashboard");
