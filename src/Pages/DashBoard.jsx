import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import book from "../assets/icons/bookDashboard.png";
import users from "../assets/icons/userDashboard.png";
import takeawayReaders from "../assets/icons/open-book.png";
import house from "../assets/icons/house.png";
import category from "../assets/icons/apps.png";
import readers from "../assets/icons/reader.png";
import HocContainer from "../components/hocContainer";
import { fetch_get} from "../api/apiManager";
import Card from "../components/card";
import { COUNT } from "../utils/constants";

function Dashboard() {
  const [counts, setCounts] = useState({
    bookCount: 0,
    categoryCount: 0,
    userCount: 0,
    activeUserCount: 0,
    inHouseCount: 0,
    takeawayCount: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch_get(`${COUNT}`);
        const { bookCount, categoryCount, userCount, issuanceCountByType, activeUserCount } = response.data;

        setCounts({
          bookCount,
          categoryCount,
          userCount,
          activeUserCount,
          inHouseCount: issuanceCountByType['InHouse'] || 0,
          takeawayCount: issuanceCountByType['Takeaway'] || 0
        });
      } catch (error) {
        return
      }
    };
    fetchCounts();
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
          <Card icon={book} count={counts.bookCount} label="Total Books" />
          <Card icon={users} count={counts.userCount} label="Users" />
          <Card icon={category} count={counts.categoryCount} label="Categories" />
 
          <Card icon={readers} count={counts.activeUserCount} label="Issued Books" />
          <Card icon={house} count={counts.inHouseCount} label="In-House Users" />
          <Card icon={takeawayReaders} count={counts.takeawayCount} label="Takeaway Readers" />
        
      </div>
    </div>
  );
}

export default HocContainer(Dashboard, "Dashboard");
