require("dotenv").config();

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

// local imports
const publicRouter = require("./routes/public");
const authRouter = require("./routes/auth");
const config = require("./config");

const app = express();

// set different http headers for security
app.use(helmet());

// allow images from twitter domains
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "img-src": ["self"],
    },
  })
);
app.use(
  helmet.crossOriginEmbedderPolicy({
    policy: "credentialless",
  })
);

// set view engine to ejs
app.set("view engine", "ejs");

// static files dir
app.use(express.static(path.join(__dirname, "../public")));

// logger
app.use(morgan("tiny"));

// parse form data
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/", publicRouter);
app.use("/auth", authRouter);

// enable cookies when serving behind a proxy
//app.enable("trust proxy");

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err);
});

app.listen(config.PORT, () => console.log("Listening on port " + config.PORT));
