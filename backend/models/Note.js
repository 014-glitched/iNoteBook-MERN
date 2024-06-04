const mongoose = require('mongoose');
const { Schema } = mongoose;



const NotesSchema = new Schema({
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'  //using User.js as a reference here cz we will get user ID as the output from the user.js model and it will be used here by user object.
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "General",
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

  module.exports = mongoose.model('notes', NotesSchema);