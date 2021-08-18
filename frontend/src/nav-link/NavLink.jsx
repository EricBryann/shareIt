import React, { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { NavLink } from "react-router-dom";

export default function NavLinks() {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>

      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add Places</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <button onClick={auth.logout} className="logout-button">
          Log Out
        </button>
      )}
    </ul>
  );
}
