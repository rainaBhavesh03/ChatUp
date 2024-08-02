const jwt = require("jsonwebtoken");

// Define constants for token expiration and secret key
const TOKEN_EXPIRATION = "30d";  // Token expiration time
const JWT_SECRET = process.env.JWT_SECRET;  // JWT secret key from environment variables

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

// Function to generate a JWT token
const generateToken = (userId) => {
  if (!userId) {
    throw new Error("User ID is required to generate a token");
  }

  const payload = { id: userId };

  // Generate the JWT token
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION,  // Set token expiration time
  });
};

module.exports = generateToken;
