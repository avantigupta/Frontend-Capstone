import React from "react";
import SideNav from "./SideNav";
import Header from "./Header";
import "../styles/HocContainer.css";

const HocContainer = (Component, title, showSideNav=true ) =>
  function HOC() {
    return (
      <>
        <Header title={title} /> 
        <div className="dashboard-hoc-container">
        {showSideNav && <SideNav />}
          <div className={showSideNav ? "dashboard-hoc-right-container" : "dashboard-hoc-full-container"}>
            <Component />
          </div>
        </div>
      </>
    );
  };

export default HocContainer;