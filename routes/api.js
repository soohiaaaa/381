const express = require('express');
const router = express.Router();

const Expense = require('../models/Expense');

// NOTE: These REST APIs are intentionally unauthenticated for the assignment requirement.

// Read - GET /api/expenses
router.get('/expenses', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) {
      query.category = category;
    }
    const expenses = await Expense.find(query).limit(100).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create - POST /api/expenses
router.post('/expenses', async (req, res) => {
  try {
    const { userId, title, amount, category, date, note } = req.body;
    if (!userId || !title || amount === undefined) {
      return res.status(400).json({ error: 'userId, title, and amount are required' });
    }
    const expense = new Expense({
      user: userId,
      title,
      amount,
      category,
      date: date || Date.now(),
      note
    });
    const saved = await expense.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create expense' });
  }
});

// Update - PUT /api/expenses/:id
router.put('/expenses/:id', async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, date, note },
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update expense' });
  }
});

// Delete - DELETE /api/expenses/:id
router.delete('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;


