require("dotenv").config();

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const http = require("http");
const { Server } = require("socket.io");

require("express-async-errors"); // handle async errors

// local imports
const db = require("./services/db");
const publicRouter = require("./routes/public");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const companyRouter = require("./routes/company");
const accountRouter = require("./routes/account");
const adminRouter = require("./routes/admin");
const socialRouter = require("./routes/social");
const postRouter = require("./routes/post");
const messagesRouter = require("./routes/messages");

const config = require("./config");
const requireAuth = require("./middleware/requireAuth");
const checkRole = require("./middleware/checkRole");
const checkVerified = require("./middleware/checkVerified");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const sessionMiddleware = cookieSession({
  secret: config.SESSION_SECRET,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  secure: process.env.NODE_ENV === "production" ? true : false,
});

app.set("trust proxy", 1);
app.use(sessionMiddleware);

// set different http headers for security
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.socket.io/"],
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
app.use(express.json());

// for templates rendering (for logged in/out users)
app.use(function (req, res, next) {
  res.locals.userId = req.session.id;
  res.locals.role = req.session.role;
  next();
});

// Routes
// -- Public Routes
app.use("/", publicRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter); // semi-public

app.use("/social", socialRouter);

// -- Protected Routes
app.use(
  "/user",
  requireAuth,
  checkRole(config.ROLES.USER),
  checkVerified,
  userRouter
);
app.use(
  "/company",
  requireAuth,
  checkRole(config.ROLES.COMPANY),
  checkVerified,
  companyRouter
);
app.use("/admin", requireAuth, checkRole(config.ROLES.ADMIN), adminRouter);

app.use("/account", requireAuth, accountRouter);

app.use("/messages", requireAuth, messagesRouter);

// enable cookies when serving behind a proxy
app.enable("trust proxy");

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err);
});

io.engine.use(sessionMiddleware);

io.on("connection", (socket) => {
  if (!socket.request.session.id) {
    socket.disconnect();
  }

  console.log("user connected to socket: ", socket.request.session.email);

  socket.on("chat-message", async (data) => {
    const userId = socket.request.session.id;
    const toUser = data.toUser;
    const roomId = [userId, toUser].sort((a, b) => a - b).join("-");
    if (!data.from || !data.toUser || !data.message) {
      console.error("Invalid message format");
      return;
    }

    try {
      await db.message.create({
        data: {
          fromUserId: data.from,
          toUserId: data.toUser,
          message: data.message,
        },
      });
      io.emit(roomId, data);
    } catch (e) {
      console.error(e);
    }
  });
});

server.listen(config.PORT, () =>
  console.log("Listening on port " + config.PORT)
);
