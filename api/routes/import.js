// This handles requests for the /api/import resource.

import express from 'express';
import expenses from '../mongoose/expenses.js';
import {
  parseImportFileContents,
  checkStringInput,
  checkAmountInput,
  checkCategoriesInput,
} from '../../utilities.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const parsedFileContents = parseImportFileContents(req.body.fileContents);
    for (let parsedRow of parsedFileContents) {
      await expenses.create(
        parsedRow.date,
        checkStringInput(parsedRow.description),
        checkAmountInput(parsedRow.amount),
        checkCategoriesInput(parsedRow.categories),
        req.user._id
      );
    }
    return res.status(201).send();
  } catch (error) {
    next(error);
  }
});

export default router;
