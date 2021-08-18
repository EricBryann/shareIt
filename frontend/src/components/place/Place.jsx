import React, { useContext, useState } from "react";
import Card from "../card/Card";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import "./Place.css";
import Button from "../button/Button";
import { useHttp } from "../useHttp";
import Modal from "../modal/Modal";
import ErrorModal from "../modal/ErrorModal";
import { AuthContext } from "../../auth/authContext";
import Map from "../map/Map";

export default function Place({
  id,
  creatorId,
  title,
  address,
  description,
  image,
  coordinates,
  onDelete,
}) {
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false); //show the Map when user clicks "view map"

  const [showConfirmModal, setShowConfirmModal] = useState(false); //show confirm modal when user wants to delete a place

  function openMapHandler() {
    setShowMap(true);
  }

  function closeMapHandler() {
    setShowMap(false);
  }

  function showDeleteWarningHandler() {
    setShowConfirmModal(true);
  }

  function cancelDeleteHandler() {
    setShowConfirmModal(false);
  }

  async function confirmDeleteHandler() {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      onDelete(id);
    } catch (err) {}
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        onCancel={closeMapHandler}
        show={showMap}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <Button
            onClick={closeMapHandler}
            title="Close"
            buttonClassName="filled"
          />
        }
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler} title="Cancel" />
            <Button
              buttonClassName="button-danger"
              onClick={confirmDeleteHandler}
              title="Delete"
            />
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          cannot be undone thereafter
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${image}`}
              alt={title}
            />
          </div>
          <div className="place-item__info">
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className="place-item__actions">
            <Button
              onClick={openMapHandler}
              buttonClassName="button-inverse"
              title="View On Map"
            ></Button>
            {auth.userId === creatorId && (
              <Button
                to={`/places/${id}`}
                title="Edit"
                style={{ color: "black" }}
              ></Button>
            )}
            {auth.userId === creatorId && (
              <Button
                buttonClassName="button-danger"
                onClick={showDeleteWarningHandler}
                title="Delete"
              ></Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}
