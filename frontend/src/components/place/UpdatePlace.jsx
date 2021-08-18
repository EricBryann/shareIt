import React, { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useHttp } from "../useHttp";
import Button from "../button/Button";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import Card from "../card/Card";
import ErrorModal from "../modal/ErrorModal";
import { AuthContext } from "../../auth/authContext";
import FormRow from "../form/FormRow";
import Form from "../form/Form";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validator = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description must be at least 5 characters"),
});

export default function UpdatePlace() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();
  const { register, setValue, handleSubmit, getValues, ...methods } = useForm({
    reValidateMode: "onChange",
    mode: "onSubmit",
    //validation
    resolver: yupResolver(validator),
  });

  //Retrieving stored title and description
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlace(responseData.place);

        setValue("title", responseData.place.title);
        setValue("description", responseData.place.description);
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId]);

  async function placeUpdateSubmitHandler(formValues) {
    try {
      const { title, description } = formValues;
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title,
          description,
        }),
        {
          "Content-type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Form
        className="place-form"
        onSubmit={handleSubmit(placeUpdateSubmitHandler)}
        title="Update Place"
      >
        <FormRow
          label="Title"
          register={register("title")}
          error={methods.formState.errors.title?.message}
        />
        <FormRow
          inputType="textArea"
          label="Description"
          register={register("description")}
          error={methods.formState.errors.description?.message}
        />
        <hr />
        <Button type="submit" title="Update" buttonClassName="filled" />
      </Form>
    </React.Fragment>
  );
}
