import React, { useEffect, useState } from "react";
import User from "./User";
import Card from "../card/Card";
import "./AllUsers.css";

export default function AllUsers({ users, filter, setFilter }) {
  const [userArray, setUserArray] = useState(users);
  useEffect(() => {
    setUserArray(
      users.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
  if (userArray.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {userArray.map((user) => {
        return (
          <User
            key={user.id}
            id={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
}
