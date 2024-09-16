import React from "react";
import SideNav from "./sideNav";
import Header from "./header";
import "../styles/hocContainer.css";

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