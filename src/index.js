const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { companyID } = jwt.verify(token, process.env.APP_SECRET);
    req.companyID = companyID;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server running on port http://localhost:${deets.port}`);
  }
);
