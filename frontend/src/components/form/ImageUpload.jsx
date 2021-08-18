import React, { useRef, useState, useEffect } from "react";
import Button from "../button/Button";
import "./ImageUpload.css";

export default function ImageUpload({ file, setFile, label }) {
  const [previewUrl, setPreviewUrl] = useState();
  const filePickerRef = useRef();
  const pickImageHandler = () => filePickerRef.current.click();

  useEffect(() => {
    if (!file) {
      return;
    }
    //Read images
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <div className="image-upload__container">
      <input
        style={{ display: "none" }}
        ref={filePickerRef}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className="image-upload center">
        {previewUrl && <img src={previewUrl} alt="Preview" />}
        {!previewUrl && <p>{label}</p>}
      </div>

      <div className="center pick-image-button">
        <Button
          type="button"
          buttonClassName="filled-red"
          onClick={pickImageHandler}
          title="Pick Image"
        ></Button>
      </div>
    </div>
  );
}
