import jwt from 'jsonwebtoken';

// Checks that a valid JWT was sent in the Authorization header.
// Attaches the decoded { email, role } to req.user for later routes to use.
export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Must run AFTER authenticateToken — checks the role on req.user
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }
  next();
}
