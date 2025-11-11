const jwt = require('jsonwebtoken');
exports.auth = (req, res, next) => {
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  if(!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if(req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};
