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

function App() {
  // const authUser = true;
  // return (
  //   <>
  //     {authUser && <Header />}
  //     <Routes>
  //       <Route path="/" element={<HomePage />} />
  //       <Route path="/login" element={<LoginPage />} />
  //       <Route path="/signup" element={<SignUpPage />} />
  //       <Route path="/transaction/:id" element={<TransactionPage />} />
  //       <Route path="*" element={<NotFound />} />
  //     </Routes>
  //   </>
  // );
  const { me } = useContext(UserContext);

  return (
    <>
      {me && <Header />}
      <Routes>
        <Route
          path="/"
          element={me ? <HomePage /> : <Navigate to={"/login"} />}
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
    </>
  );
}

export default App;