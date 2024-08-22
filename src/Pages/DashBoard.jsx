import React from "react";
import DashBoardHOC from "../Components/DashBoardHOC";
import background from "../Assets/cta-bg.png";
import library from "../Assets/our-libraries.png"
function Dashboard() {
  return (
    <div>
    <img src={background} alt="/" className="bg-img" />
    <img src={library} alt="/" className="bg-libraries-img" />
    </div>
  );
}

export default DashBoardHOC(Dashboard);