import { loginQuery, signupQuery } from "../graphql/mutations/user.mutations";
import { createAxios } from "../lib/axios";

export async function login({ username, password }) {
  try {
    const res = await createAxios().post("http://localhost:3001/graphql", {
      query: loginQuery,
      variables: {
        username: username,
        password: password,
      },
    });
    return res;
  } catch (error) {
    console.error("Error occurred during login:", error);
    throw error;
  }
}

export async function signup({ fullName, username, password, gender, email }) {
  try {
    const res = await createAxios().post("http://localhost:3001/graphql", {
      query: signupQuery,
      variables: {
        input: {
          username: username,
          password: password,
          fullName: fullName,
          gender: gender,
          email: email,
        },
      },
    });
    return res;
  } catch (error) {
    console.error("Error occurred during sign up:", error);
    throw error;
  }
}
