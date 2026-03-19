import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },

  description: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  settled: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);