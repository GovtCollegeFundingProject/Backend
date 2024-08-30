const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

const extractEmailFromToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extract the token part after 'Bearer '

    try {
      const decodedToken = jwt.verify(token, secretKey);
      console.log(decodedToken); // Verify the token
      req.userEmail = decodedToken.userId;
      req.role = decodedToken.role;
      console.log(req.userEmail);
      // Attach the email to the request object
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Authorization token required" });
  }
};

module.exports = { extractEmailFromToken };
