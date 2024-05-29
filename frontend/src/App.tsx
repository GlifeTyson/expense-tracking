import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import TransactionPage from "./pages/TransactionPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Header from "./components/ui/Header.tsx";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "./contexts/UserProvider.tsx";
import React from "react";
import AdminPage from "./pages/AdminPage.tsx";
import AdminHeader from "./components/ui/AdminHeader.tsx";

function App() {
  const { me } = useContext(UserContext);
  // console.log("me", me?.role.name);
  return (
    <div className={me?.role?.name === "superadmin" ? "bg-white" : "bg-black"}>
      {me && (me?.role.name === "user" ? <Header /> : <AdminHeader />)}
      <Routes>
        <Route
          path="/"
          element={
            me ? (
              me?.role.name === "user" ? (
                <HomePage />
              ) : (
                <AdminPage />
              )
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/login"
          element={!me ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!me ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/transaction/:id"
          element={me ? <TransactionPage /> : <Navigate to={"/login"} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
