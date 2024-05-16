import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import mergedResolver from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { connectDb } from "./db/connectDb.js";
import { GraphQLLocalStrategy, buildContext } from "graphql-passport";
import { passportConfig } from "./passport/passport.config.js";
import path from "path";

dotenv.config(); // load .env
passportConfig(); // initialize passport
// Required logic for integrating with Express
const app = express();
const __dirname = path.resolve();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);
const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});
store.on("error", (error) => {
  console.log(error);
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, //this option is used to prevent session resave on every request
    saveUninitialized: false, //this option is used to prevent saving uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //expires after 7 days (1s * 60) = (1 min * 60) = (1 hour * 24) *7 = 1 day * 7
      httpOnly: true, //this option is prevented from being accessed by client-side javascript
    },
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolver,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
  express.json({ limit: "50mb" }), // parse JSON bodies
  express.urlencoded({ extended: true, limit: "50mb" }), // parse URL-encoded bodies
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res }),
  })
);

// npm run build will build your frontend app, and it will the optimized version of your app
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDb();

console.log(`🚀 Server ready at http://localhost:4000/graphql `);
