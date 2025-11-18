const express = require('express');
const router = express.Router();

const Expense = require('../models/Expense');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// List & search expenses
router.get('/', requireAuth, async (req, res) => {
  try {
    const { category, minAmount, maxAmount, fromDate, toDate } = req.query;
    const query = { user: req.session.user.id };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (minAmount) {
      query.amount = query.amount || {};
      query.amount.$gte = Number(minAmount);
    }
    if (maxAmount) {
      query.amount = query.amount || {};
      query.amount.$lte = Number(maxAmount);
    }
    if (fromDate) {
      query.date = query.date || {};
      query.date.$gte = new Date(fromDate);
    }
    if (toDate) {
      query.date = query.date || {};
      query.date.$lte = new Date(toDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.render('expenses/index', { expenses, filters: req.query });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading expenses.');
  }
});

// New expense form
router.get('/new', requireAuth, (req, res) => {
  res.render('expenses/new', { expense: {}, error: null });
});

// Create expense
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = new Expense({
      user: req.session.user.id,
      title,
      amount,
      category,
      date: date || Date.now(),
      note
    });
    await expense.save();
    res.redirect('/expenses');
  } catch (err) {
    console.error(err);
    res.status(400).render('expenses/new', { expense: req.body, error: 'Error creating expense.' });
  }
});

// Edit form
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!expense) {
      return res.status(404).send('Expense not found');
    }
    res.render('expenses/edit', { expense, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading expense.');
  }
});

// Update expense
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user.id },
      { title, amount, category, date: date || Date.now(), note },
      { new: true, runValidators: true }
    );
    if (!expense) {
      return res.status(404).send('Expense not found');
    }
    res.redirect('/expenses');
  } catch (err) {
    console.error(err);
    res.status(400).send('Error updating expense.');
  }
});

// Delete expense
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
    res.redirect('/expenses');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting expense.');
  }
});

module.exports = router;


