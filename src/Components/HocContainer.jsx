import React from "react";
import SideNav from "./SideNav";
import Header from "./Header";
import "../Styles/HocContainer.css";

const HocContainer = (Component, title ) =>
  function HOC() {
    return (
      <>
        <Header title={title}/> 
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