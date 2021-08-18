import React, { useState, useEffect } from "react";
import AllUsers from "../components/user/AllUsers";
import { useHttp } from "../components/useHttp";
import LoadingSpinner from "../components/loading-spinner/LoadingSpinner";
import ErrorModal from "../components/modal/ErrorModal";

export default function AllUsersPage({ filter, setFilter }) {
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const [allUsers, setAllUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        setAllUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && allUsers && (
        <AllUsers users={allUsers} filter={filter} setFilter={setFilter} />
      )}
    </>
  );
}
