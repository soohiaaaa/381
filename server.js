require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const apiRoutes = require('./routes/api');

const app = express();

// ----- Database connection -----
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// ----- View engine setup -----
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');

// ----- Middleware -----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

// ----- Session -----
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions'
    })
  })
);

// ----- Template locals -----
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.error = null;
  res.locals.success = null;
  next();
});

// ----- Routes -----
app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.redirect('/expenses');
});

app.use('/', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/api', apiRoutes);

// ----- 404 handler -----
app.use((req, res) => {
  res.status(404).render('404');
});

// ----- Error handler -----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.originalUrl.startsWith('/api')) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  res.status(500).send('Something went wrong. Please try again later.');
});

// ----- Start server -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Expense Tracker app listening on port ${PORT}`);
});


