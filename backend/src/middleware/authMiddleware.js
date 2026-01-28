const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const tokenClean = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenClean, process.env.JWT_SECRET);

    req.user = decoded; 

    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};