import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../components/modal/ErrorModal";
import AllPlaces from "../components/place/AllPlaces";
import { useHttp } from "../components/useHttp";
import LoadingSpinner from "../components/loading-spinner/LoadingSpinner";

//To show a list of places that a user posted
export default function MyPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const userId = useParams().userId;
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    console.log(deletedPlaceId);
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <AllPlaces places={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  );
}
