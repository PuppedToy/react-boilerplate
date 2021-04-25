const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const unauthorized = () => {
    req.isAuthorized = false;
    req.userToken = null;
    next();
  };

  const authParts = (
    req.headers.authorization ||
    req.headers.Authorization ||
    ''
  ).split(' ');
  if (authParts.length <= 1) {
    return unauthorized();
  }

  const [bearerPrefix, token] = authParts;
  if (bearerPrefix.toLowerCase() !== 'bearer') {
    return unauthorized();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken && decodedToken.id) {
      req.isAuthorized = true;
      req.userToken = decodedToken;
      next();
    } else {
      unauthorized();
    }
  } catch (error) {
    unauthorized();
  }
  return null;
}
module.exports.authMiddleware = authMiddleware;
