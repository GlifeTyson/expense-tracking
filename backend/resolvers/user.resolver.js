import { users } from "../dummyData/data.js";
const userResolver = {
  Query: {
    users: () => {
      return users;
    },
    user: (_, { userId }) => {
      const userMap = new Map(users.map((user) => [user._id, user]));
      return userMap.get(userId);
    },
  },
  Mutation: {},
};

export default userResolver;
