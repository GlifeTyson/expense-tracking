import JsCookie from "js-cookie";
import { domainOpts } from "../utils/cookies";

export default {
  constructor() {
    this.initialize();
  },
  state: {
    "x-token": null,
  },
  initialize() {
    if (typeof window !== "undefined") {
      this.state[`x-token`] =
        localStorage.getItem("x-token") || JsCookie.get("x-token");
    }
  },
  set(token) {
    if (typeof window !== "undefined") {
      JsCookie.set("x-token", token, { expires: 365 });
      localStorage.setItem("x-token", token);
    }
    this.initialize();
    return true;
  },
  setAsyncToken(token) {
    if (typeof window !== "undefined") {
      JsCookie.set("x-token", token, { expires: 365, ...domainOpts() });

      localStorage.setItem("x-token", token);
    }
    this.initialize();
    return true;
  },
  check() {
    this.initialize();
    if (typeof window !== "undefined") {
      const token = this.state[`x-token`];

      if (token === null || token === "null") {
        return false;
      } else {
        return true;
      }
    }
  },
  login(token) {
    return this.set(token);
  },
  logout() {
    JsCookie.remove("x-token");
    localStorage.removeItem("x-token");
    const token = localStorage.getItem("x-token") || JsCookie.get("x-token");
    if (token) {
      return false;
    } else {
      return true;
    }
  },
};
