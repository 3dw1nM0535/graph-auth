const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress } = require("apollo-server-express");
const jwt = require("express-jwt");
const schema = require("./schema/schema");

require("dotenv").config();
const app = express();

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
});

app.use(
  "/api/",
  bodyParser.json(),
  auth,
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user
    }
  }))
);

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}/api/`)
);
