import Jwt from "jsonwebtoken";
import envconfig from "../config/envConfig.js";


const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(500).json({ message: "authorization token is missing" });
  }
  const verify = Jwt.verify(
    token,
    envconfig.SECRET_KEY,
    (error, user) => {
      if (error) {
        return res.status(404).json({ message: "invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

export {verifyToken};