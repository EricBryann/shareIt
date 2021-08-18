import React from "react";
import "./FormRow.css";

export default function FormRow({
  label,
  type,
  inputType = "input",
  register,
  error,
}) {
  return (
    <div className="formRow">
      <div className="label">{label}</div>
      {inputType === "input" && (
        <div>
          <input {...register} className="input" type={type} />
          <div className="error">{error}</div>
        </div>
      )}
      {inputType === "textArea" && (
        <div>
          <textarea {...register} type="text" className="textarea" />
          <div className="error">{error}</div>
        </div>
      )}
    </div>
  );
}
