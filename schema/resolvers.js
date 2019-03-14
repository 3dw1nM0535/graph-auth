const { User } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const resolvers = {
  Query: {
    // Fetch profile of currently authenticated user
    async me(_, args, { user }) {
      // Make sure user is logged in
      if (!user) throw new Error("You are not athenticated");

      // Return authenticated user
      return await User.findOne({
        where: {
          id: user.id
        }
      });
    }
  },

  Mutation: {
    // Create new user
    async signup(_, { username, email, password }) {
      const user = User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10)
      });

      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
    },

    // Handle user login
    async login(_, { email, password }) {
      const user = await User.findOne({ where: { email } });

      if (!user) throw new Error("No user with such an email");

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) throw new Error("Incorrect password");

      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
    }
  }
};

module.exports = resolvers;
