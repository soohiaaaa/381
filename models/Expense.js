const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'],
      default: 'Other'
    },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);


