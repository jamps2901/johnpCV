// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  console.log("authMiddleware token received:", token);
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    // Remove "Bearer " prefix if it exists
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    // Verify token with explicit algorithm option
    const decoded = jwt.verify(actualToken, JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded;
    console.log("Token decoded successfully:", decoded);
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
