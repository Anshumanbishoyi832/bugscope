import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

    try {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();

    } catch (error) {

      res.status(401).json({ message: "Not authorized" });

    }

  } else {

    res.status(401).json({ message: "No token" });

  }

};

export default protect;