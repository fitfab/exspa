This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Adding Express Server App

The [convinience](https://stackoverflow.com/questions/17696801/express-js-app-listen-vs-server-listen) of using `createServer` from node

$ `yarn add express compression morgan`

```js
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
const app = express();

// Check Expressjs default env variable
const dev = app.get("env") !== "production";

// Run Production setup
if (!dev) {
  // disable `x-power-by` header for security reasons
  // that way people don't that server is power express.
  app.disable("x-power-by");

  // Compression middleware for gzip
  app.use(compression());

  // Loggin middleware with the common flag
  app.use(morgan("common"));
}

if (dev) {
  // Logging middleware with the dev flag
  app.use(morgan("dev"));
  console.log("dev:", buildFolder);
}

// Point to the build for the static files
app.use(express.static(buildFolder));

// Route any request coming in
// to be handle by the SPA. -- must use `*`
// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#serving-apps-with-client-side-routing
app.use("*", (req, res, next) => {
  res.sendFile(`${buildFolder}/index.html`);
});

// create the server
const server = createServer(app);

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`
    [ server started in port: ${PORT} ]
  `);
});
```
