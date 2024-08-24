import React from "react";
import SideNav from "./SideNav";
import Header from "./Header";
import "../Styles/HocContainer.css";

const HocContainer = (Component) =>
  function HOC() {
    return (
      <>
        <Header title="Dashboard"/> 
        <div className="dashboard-hoc-container">
          <SideNav />
          <div className="dashboard-hoc-right-container">
            <Component />
          </div>
        </div>
      </>
    );
  };

export default HocContainer;