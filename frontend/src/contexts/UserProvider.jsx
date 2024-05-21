import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import useSWR from "swr";
import { fetchMe } from "../graphql/queries/user.queries";
import { fetcher } from "../services/fetcher";

const UserContext = React.createContext();

function UserProvider({ children }) {
  const [me, setMe] = useState(null);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    [fetchMe, {}],
    fetcher
  );
  useEffect(() => {
    if (!isValidating) {
      if (error) {
        setMe(null);
      } else {
        const { Me } = data || {};
        if (Me) {
          setMe(Me);
        }
      }
    }
  }, [data, error, isValidating]);

  function handleLogout() {
    const response = Auth.logout();
    if (response) {
      window.location.href = "/login";
    } else {
    }
  }

  return (
    <UserContext.Provider
      value={{
        me,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

const UserConsumer = UserContext.Consumer;

export default UserProvider;
export { UserConsumer, UserContext };
