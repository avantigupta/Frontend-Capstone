import React from "react";
import SideNav from "./SideNav";
import Header from "./Header";

const DashboardHoc = (Component) =>
  function HOC() {
    return (
      <>
        <Header />
        <div className="dashboard-hoc-container">
          <SideNav />
          <div className="dashboard-hoc-right-container">
            <Component />
          </div>
        </div>
      </>
    );
  };

export default DashboardHoc;