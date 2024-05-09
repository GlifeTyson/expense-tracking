import { gql } from "@apollo/client";

// Define mutation
export const SIGN_UP = gql`
  # Increments a back-end counter and gets its resulting value
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      _id
      name
      username
    }
  }
`;
export const SIGN_OUT = gql`
  mutation SignOut {
    logout {
      message
    }
  }
`;
export const LOG_IN = gql`
  mutation LogIn($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      username
    }
  }
`;
