import "./App.css";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import Auth from "./components/form/Auth";
import Header from "./components/Header/Header";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import MyPlaces from "./pages/MyPlaces";
import AddPlaces from "./components/place/AddPlaces";
import SideBar from "./components/sidebar/SideBar";
import AllUsersPage from "./pages/AllUsersPage";
import { AuthContext } from "../src/auth/authContext";
import LoadingSpinner from "./components/loading-spinner/LoadingSpinner";
import UpdatePlace from "./components/place/UpdatePlace";

let logoutTimer;

function App() {
  const [token, setToken] = useState(false); //for authorization
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [name, setName] = useState();
  const [filter, setFilter] = useState("");

  const login = useCallback((name, uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setName(name);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        name: name,
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setName(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.name,
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <AllUsersPage filter={filter} setFilter={setFilter} />
        </Route>
        <Route path="/:userId/places" exact>
          <MyPlaces />
        </Route>
        <Route path="/places/new">
          <AddPlaces />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <AllUsersPage filter={filter} setFilter={setFilter} />
        </Route>
        <Route path="/:userId/places" exact>
          <MyPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={
        // Allowing other components to have access to these variables
        {
          isLoggedIn: !!token, //convert into true/false
          token,
          userId,
          name,
          login,
          logout,
        }
      }
    >
      <Router>
        <Header filter={filter} setFilter={setFilter} />
        <div className="app">
          <SideBar />
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
