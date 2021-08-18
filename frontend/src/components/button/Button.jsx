import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

export default function Button({
  title,
  buttonClassName,
  onClick,
  to,
  style,
  type = "button",
}) {
  return (
    <button
      className={`button ${buttonClassName}`}
      onClick={onClick}
      style={style}
      type={type}
    >
      {to ? (
        <Link to={to} className="button-normal">
          {title}
        </Link>
      ) : (
        title
      )}
    </button>
  );
}
