const mongoose = require("mongoose");

const chat = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 256,
  },
  time: {
    type: String,
  },
});
const ChatDB = mongoose.createConnection(process.env.DATABASE_CHAT);
const ChatDBModel = ChatDB.model("messages", chat);

module.exports = ChatDBModel;
