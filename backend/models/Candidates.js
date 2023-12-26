const mongoose = require("mongoose");
const { Schema } = mongoose;
const candidateSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phonenumber: {
      type: Number,
      required: true,
      trim: true,
    },
    testcode: {
      type: String,
      required: true,
    },
    timetaken: {
      type: Number,
      default: null,
    },
    tabswitch: {
      type: Number,
      default: 0,
    },
    result: {
      type: [
        {
          language: {
            type: String,
            trim: true,
          },
          question: {
            type: String,
            trim: true,
          },
          code: {
            type: String,
            trim: true,
          },
          score:{
            type: Number,
          },
          queNumber:{
            type: Number,
          },
          optionSelected:{
            type: String,
          }
        },
      ],
      default: [], 
    },
  });
  
module.exports = mongoose.model("Candidate", candidateSchema);
