import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/authContext";
import { useHistory, useLocation } from "react-router-dom";
import SideDrawer from "../side-drawer/SideDrawer";
import Backdrop from "../modal/Backdrop";
import NavLinks from "../../nav-link/NavLink";
import "./Header.css";

export default function Header({ filter, setFilter }) {
  const history = useHistory();
  const location = useLocation();
  const [url, setUrl] = useState(history.location.pathname);
  const auth = useContext(AuthContext);

  const name = auth.isLoggedIn ? auth.name : "";

  useEffect(() => {
    setUrl(location.pathname);
  }, [location]);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function openDrawer() {
    setDrawerIsOpen(true);
  }

  function closeDrawer() {
    setDrawerIsOpen(false);
  }

  return (
    <div className="header">
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      )
      <button className="main-navigation__menu-btn" onClick={openDrawer}>
        <span />
        <span />
        <span />
      </button>
      <div className="appName">ShareIt</div>
      {url === "/" && (
        <div className="header-input-container">
          <input
            placeholder="Search Name"
            className="header-input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      )}
      {auth.isLoggedIn && (
        <div className="userName">
          <div
            className="name"
            onClick={() => history.push(`/${auth.userId}/places`)}
          >
            {name}
          </div>
        </div>
      )}
    </div>
  );
}
