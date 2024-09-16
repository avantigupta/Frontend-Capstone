
import React from "react";

function Card({ icon, count, label }) {
  return (
    <div className="dashboard-card">
      <img src={icon} alt={label} className="dashboard-icons" />
      <h3 className="count">{count} {label}</h3>
    </div>
  );
}

export default Card;
