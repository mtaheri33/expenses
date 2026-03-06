// This contains middleware functions used throughout the server files.

function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).send();
  }
  next();
}

export {
  requireUser,
};
