// Put all non-front-end code here
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Configure environment variables in .env file
require("dotenv").config();

const planner = require("./planner/planner");

app
  .prepare()
  .then(() => {
    const server = express();

    // Set up backend route
    server.use("/api", planner);

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });

  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
