const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 12,
    minlength: 6,
  },
  password: { type: String, required: true, maxlength: 16, minlength: 8 },

  is_online: {
    type: Boolean,
    default: false,
  },
});
const UserDB = mongoose.createConnection(process.env.DATABASE_USERS);
const UserDBModel = UserDB.model("users", user);

module.exports = UserDBModel;
