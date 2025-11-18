const express = require('express');
const router = express.Router();

const User = require('../models/User');

function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect('/expenses');
  }
  next();
}

router.get('/register', redirectIfAuthenticated, (req, res) => {
  res.render('auth/register', { error: null });
});

router.post('/register', redirectIfAuthenticated, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).render('auth/register', { error: 'Username and password are required.' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res
        .status(400)
        .render('auth/register', { error: 'Username already taken. Please choose another one.' });
    }

    const user = new User({ username });
    await user.setPassword(password);
    await user.save();

    req.session.user = { id: user._id, username: user.username };
    res.redirect('/expenses');
  } catch (err) {
    console.error(err);
    res.status(500).render('auth/register', { error: 'Server error while registering.' });
  }
});

router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', { error: null });
});

router.post('/login', redirectIfAuthenticated, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).render('auth/login', { error: 'Invalid username or password.' });
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(400).render('auth/login', { error: 'Invalid username or password.' });
    }

    req.session.user = { id: user._id, username: user.username };
    res.redirect('/expenses');
  } catch (err) {
    console.error(err);
    res.status(500).render('auth/login', { error: 'Server error while logging in.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;


