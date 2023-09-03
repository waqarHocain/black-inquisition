require("dotenv").config();

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieSession = require("cookie-session");

// local imports
const publicRouter = require("./routes/public");
const authRouter = require("./routes/auth");
const userProfileRouter = require("./routes/userProfile");
const config = require("./config");

const app = express();

app.use(
  cookieSession({
    name: "session",
    secret: config.SESSION_SECRET,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === "production" ? true : false,
    //httpOnly: true,
  })
);

// enable cookies when serving behind a proxy
app.enable("trust proxy");

// set different http headers for security
app.use(helmet());

// allow images from twitter domains
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
      "script-src": ["'self'", "'unsafe-inline'"],
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
// Public Routes
app.use("/", publicRouter);
app.use("/auth", authRouter);
// Protected Routes
app.use("/user", userProfileRouter);

// enable cookies when serving behind a proxy
//app.enable("trust proxy");

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err);
});

app.listen(config.PORT, () => console.log("Listening on port " + config.PORT));
