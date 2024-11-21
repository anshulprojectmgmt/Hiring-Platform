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
    exitfullscreen: {
      type: Number,
      default: null,
    },
    cam2: {
      type: Number,
      default: null,
    },
    cam2Time: {
      type: Number,   
      default: null,  
  },
  face: {
    type: Number,
    default: null,
  },
  hands: {
    type: Number,
    default: null,
  },
  keyboard: {
    type: Number,
    default: null,
  },
  cam2Face : {
    type: String,
    default: null,
  },
  cam2SideView : {
    type: String,
    default: null,
  },
  
  cam1Img : {
    type: String,
    default: null,
  },
  screenshots: {
    type: [String],  // Array of strings
    default: [],     // Default value is an empty array
  },
  cam2Screenshots: {
    type: [String],  // Array of strings
    default: [],     // Default value is an empty array
  },
  
  verdict: {
    type: {
      status: {
        type: String
      },
      message:{
        type: String
      },
    },
    default: null
    
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
          },
          subjVideoUrl:{
            type: String,
          },
          speechResult: {
            type: Object
          }
        },
      ],
      default: [], 
    },
  userFeedback: {
    type: Object,
    default: {}
  }
  });
  
module.exports = mongoose.model("Candidate", candidateSchema);
