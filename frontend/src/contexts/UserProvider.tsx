import React, { useState, useEffect } from "react";
import Auth from "../utils/auth.ts";
import useSWR from "swr";
import { fetchMe } from "../graphql/queries/user.queries";
import { fetcher } from "../services/fetcher";
interface User {
  id: string;
  name: string;
  profilePicture: string;
}
interface UserContextType {
  me: User | null;
  handleLogout: () => void;
}
const defaultContextValue: UserContextType = {
  me: null,
  handleLogout: () => {},
};
const UserContext = React.createContext<UserContextType>(defaultContextValue);

function UserProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<User | null>(null);

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
