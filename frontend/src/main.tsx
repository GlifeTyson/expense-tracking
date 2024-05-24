import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import GridBackground from "./components/ui/GridBackground.tsx";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import UserProvider from "./contexts/UserProvider.tsx";

const client = new ApolloClient({
  // if deploy , change to uri
  uri: "http://localhost:3001/graphql",
  // import.meta.env.VITE_NODE_ENV === "development"
  //   ? "http://localhost:4000/graphql"
  //   : "http://localhost:3001/graphql", // the URL of our GraphQL server.
  cache: new InMemoryCache(), // for in-memory caching
  credentials: "include", // for cookies sending per request
});

const rootDiv = document.getElementById("root")!;
ReactDOM.createRoot(rootDiv).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>
        <UserProvider>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </UserProvider>
      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>
);
