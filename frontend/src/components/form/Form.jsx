import React from "react";
import "./Form.css";

export default function Form({ title, children, onSubmit }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="title">
        {title}
        <hr />
      </div>
      {children}
    </form>
  );
}
