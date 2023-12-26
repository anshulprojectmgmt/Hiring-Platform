const mongoose = require("mongoose");
const { Schema } = mongoose;

const hiringManagerSchema = new Schema({
  hiring_manager: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  tests: [
    {
      type: {
        type: String,
        required: true,
        trim: true,
      },
      language: {
        type: String,
        required: true,
        trim: true,
      },
      difficulty: {
        type: String,
        required: true,
        trim: true,
      },
      questions: {
        type: Number,
        required: true,
        trim: true,
      },
      duration: {
        type: Number,
        required: true,
        trim: true,
      },
      testcode: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      proctored: {
        type: String,
        default: "No",
      },
    },
  ],
});

module.exports = mongoose.model("HiringManager", hiringManagerSchema);
