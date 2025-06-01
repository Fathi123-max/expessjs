//create auth middleware
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleware = (req, res, next) => {
  // x-auth-token is a custom header that we use to send the JSON Web Token from the client
  // to the server. The client should include this header in the request and the server
  // will verify the token and grant access to the requested resource if the token is valid.
  const token = req.header("x-auth-token") || req.query.token || req.body.token;
  if (!token || typeof token !== "string" || token.trim() === "") {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // if the error is a TokenExpiredError then we can return a 401 status
    // with a message indicating that the token has expired
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token has expired, please log in again" });
    }
    // otherwise we can just return a 401 status with a message indicating
    // that the token is not valid
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
