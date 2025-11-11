const jwt = require("jsonwebtoken");

exports.auth = (roles = []) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ message: "Forbidden" });

      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
