import React from "react";
import "./Avatar.css";

export default function Avatar({ image, alt, width }) {
  return (
    <div className="avatar">
      <img src={image} alt={alt} style={{ width: width, height: width }} />
    </div>
  );
}
