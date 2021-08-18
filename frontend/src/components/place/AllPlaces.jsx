import React from "react";
import Card from "../card/Card";
import Button from "../button/Button";
import Place from "./Place";
import "./AllPlaces.css";

export default function AllPlaces({ places, onDeletePlace }) {
  if (places.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new" title="Add Place" buttonClassName="filled" />
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {places.map((place) => (
        <Place
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={onDeletePlace}
        />
      ))}
    </ul>
  );
}
