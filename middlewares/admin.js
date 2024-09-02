const jwt = require("jsonwebtoken");

const verifyAdminRole = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Access denied, admin role required" });
    }

    // Attach user information to the request object
    req.userEmail = decoded.email;
    req.role = decoded.role;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyAdminRole };
