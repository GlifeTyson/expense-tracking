import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const passportConfig = async () => {
  passport.serializeUser((user, done) => {
    console.log("Serializing user");
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    console.log("Deserializing user");
    try {
      const user = await User.findById(_id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          throw new Error("Username not found");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Password is not correct");
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
