import React, { useState, useEffect, useContext } from "react";
import Form from "./Form";
import FormRow from "./FormRow";
import Button from "../button/Button";
import ImageUpload from "./ImageUpload";
import { AuthContext } from "../../auth/authContext";
import { useHttp } from "../useHttp";
import ErrorModal from "../modal/ErrorModal";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./Auth.css";

const loginValidator = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const signupValidator = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  image: yup.mixed().required("Please provide a profile picture"),
});

export default function Auth() {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [file, setFile] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttp();
  const { register, setValue, handleSubmit, getValues, ...methods } = useForm({
    reValidateMode: "onChange",
    mode: "onSubmit",
    //validation
    resolver: yupResolver(isLogin ? loginValidator : signupValidator),
  });

  const mainHandler = async (formValues) => {
    if (isLogin) {
      const { email, password } = formValues;
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email,
            password,
          }),
          {
            "Content-type": "application/json",
          }
        );
        auth.login(responseData.name, responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const { email, password, name, image } = formValues;
        const formData = new FormData(); //Use FormData for images
        formData.append("email", email);
        formData.append("name", name);
        formData.append("password", password);
        formData.append("image", image);
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );
        auth.login(responseData.name, responseData.userId, responseData.token);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const switchHandler = () => setIsLogin((prev) => !prev);

  useEffect(() => {
    setValue("image", file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <Form
        title={isLogin ? "Login" : "Sign Up"}
        onSubmit={handleSubmit(mainHandler)}
      >
        {!isLogin && (
          <FormRow
            label="Name"
            register={register("name")}
            error={methods.formState.errors.name?.message}
          />
        )}
        <FormRow
          label="Email"
          register={register("email")}
          error={methods.formState.errors.email?.message}
        />
        <FormRow
          label="Password"
          type="password"
          register={register("password")}
          error={methods.formState.errors.password?.message}
        />
        {!isLogin && (
          <>
            <ImageUpload
              file={file}
              setFile={setFile}
              label="Profile Picture"
            />
            <p className="imageError">
              {methods.formState.errors.image?.message}
            </p>
          </>
        )}
        <hr />
        <Button
          title={isLogin ? "Login" : "Sign Up"}
          buttonClassName="filled"
          type="submit"
        />
        <Button
          title={isLogin ? "Switch to Sign Up" : "Switch to Login"}
          buttonClassName="outline"
          onClick={switchHandler}
        />
      </Form>
    </>
  );
}
