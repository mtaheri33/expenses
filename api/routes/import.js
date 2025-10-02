// This handles requests for the /api/import resource.

import { ImportMode } from '../../constants.js';
import express from 'express';
import expenses from '../mongoose/expenses.js';
import {
  parseImportFileContents,
  checkStringInput,
  checkAmountInput,
  checkCategoriesInput,
} from '../../utilities.js';

const router = express.Router();

function importPreview(parsedFileContents, userId) {
  const previewExpenses = [];
  for (let i = 0; i < parsedFileContents.length; i++) {
    const parsedRow = parsedFileContents[i];
    const expense = expenses.createWithoutSave(
      parsedRow.date,
      checkStringInput(parsedRow.description),
      checkAmountInput(parsedRow.amount),
      checkCategoriesInput(parsedRow.categories),
      userId,
    );
    if (!expense.valid()) {
      return i + 2;
    }
    previewExpenses.push(expense);
  }
  return previewExpenses;
}

async function importSave(parsedFileContents, userId) {
  for (let parsedRow of parsedFileContents) {
    await expenses.createWithSave(
      parsedRow.date,
      checkStringInput(parsedRow.description),
      checkAmountInput(parsedRow.amount),
      checkCategoriesInput(parsedRow.categories),
      userId,
    );
  }
}

router.post('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }
    const parsedFileContents = parseImportFileContents(req.body.fileContents);
    if (Number.isInteger(parsedFileContents)) {
      return res.status(400).send(parsedFileContents);
    }
    if (req.query.mode === ImportMode.PREVIEW) {
      const previewExpenses = importPreview(parsedFileContents, req.user._id);
      if (Number.isInteger(previewExpenses)) {
        return res.status(400).send(previewExpenses);
      }
      return res.status(200).json(previewExpenses.map((expense) => expense.convertToJSONObject()));
    } else if (req.query.mode === ImportMode.SAVE) {
      await importSave(parsedFileContents, req.user._id);
      return res.status(201).send();
    }
    return res.status(400).send('Import mode is invalid.');
  } catch (error) {
    next(error);
  }
});

export default router;
