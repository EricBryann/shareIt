import React from "react";
import Avatar from "./Avatar";
import UserCard from "../card/Card";
import "./User.css";
import { Link } from "react-router-dom";

export default function User({ id, image, alt, name }) {
  return (
    <li className="container">
      <UserCard className="content">
        <Link to={`/${id}/places`}>
          <div className="image">
            <Avatar
              image={`${process.env.REACT_APP_ASSET_URL}/${image}`}
              alt={alt}
            />
          </div>
          <div className="info">
            <h2>{name}</h2>
          </div>
        </Link>
      </UserCard>
    </li>
  );
}
