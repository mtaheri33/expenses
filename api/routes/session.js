// This handles requests for the /api/session resource.

import express from 'express';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (req.user) {
      return res.status(200).json({ id: req.user.id });
    }
    return res.status(401).send();
  } catch (error) {
    next(error);
  }
});

export default router;
