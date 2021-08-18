import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Form from "../form/Form";
import FormRow from "../form/FormRow";
import Button from "../button/Button";
import ImageUpload from "../form/ImageUpload";
import { useHttp } from "../useHttp";
import { AuthContext } from "../../auth/authContext";
import ErrorModal from "../modal/ErrorModal";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./AddPlaces.css";

const validator = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
  address: yup.string().required("Address is required"),
  image: yup.mixed().required("Please provide an image"),
});

export default function AddPlaces() {
  const [file, setFile] = useState();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const { register, setValue, handleSubmit, getValues, ...methods } = useForm({
    reValidateMode: "onChange",
    mode: "onSubmit",
    //validation
    resolver: yupResolver(validator),
  });

  useEffect(() => {
    setValue("image", file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const createHandler = async (formValues) => {
    const { title, description, address, image } = formValues;
    try {
      const formData = new FormData(); //FormData accepts not only text but also images
      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("image", image);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places`,
        "POST",
        formData,
        { Authorization: "Bearer " + auth.token }
      );
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Form title="Create Post" onSubmit={handleSubmit(createHandler)}>
        <FormRow
          label="Title"
          register={register("title")}
          error={methods.formState.errors.title?.message}
        />
        <FormRow
          label="Description"
          register={register("description")}
          inputType="textArea"
          error={methods.formState.errors.description?.message}
        />
        <FormRow
          label="Address"
          register={register("address")}
          error={methods.formState.errors.address?.message}
        />
        <ImageUpload file={file} setFile={setFile} label="Add a picture" />
        <p className="imageError">{methods.formState.errors.image?.message}</p>
        <hr />
        <Button title="Create" buttonClassName="filled" type="submit" />
      </Form>
    </>
  );
}
