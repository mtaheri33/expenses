// This handles requests for the /api/sign-out resource.

import express from 'express';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }
      res.clearCookie('connect.sid', {
        path: '/',
        sameSite: 'lax',
        secure: process.env.EXPRESS_SESSION_SECURE === 'false' ? false : true,
      });
      return res.status(200).send();
    });
  } catch (error) {
    next(error);
  }
});

export default router;
