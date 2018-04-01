const { createServer } = require("http");
const path = require("path");
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");

// Reference to the build(SPA) directory
const buildFolder = path.resolve(__dirname, "../build");

// set the port number
const PORT = process.env.PORT || 5000;

// Create the web app application with Expressjs
// P.S. if there was a need for websocket one can
//      create another app.
const app = express();

// Check Expressjs default env variable
const dev = app.get("env") !== "production";

// Run Production setup
if (!dev) {
  // disable `x-power-by` header for security reason
  // that way people don't this is express server
  app.disable("x-power-by");

  // Compression middleware for gzip
  app.use(compression());

  // Loggin middleware with the common flag
  app.use(morgan("common"));

  // Point to the build for the static files
  app.use(express.static(buildFolder));

  // Set a route to handle any request coming in
  // to be handle by the SPA. -- must use `*`
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#serving-apps-with-client-side-routing
  app.use("*", (req, res, next) => {
    res.sendFile(`${buildFolder}/index.html`);
  });
}

if (dev) {
  // Loggin middleware with the dev flag
  app.use(morgan("dev"));
  console.log("dev:", buildFolder);
}

// create the server
const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;
  console.log("server started @ port: ", PORT);
});
