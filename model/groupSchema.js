const mongoose = require("mongoose");

const message = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const room = new mongoose.Schema({
  messages: [message],
});

const groupSchema = new mongoose.Schema({
  users: [
    {
      type: String,
      required: true,
    },
  ],
  rooms: [room],
});

const GroupDB = mongoose.createConnection(process.env.DATABASE_GROUPS);
// const GroupDBModel = GroupDB.model("group-test", group);

module.exports = {
  GroupDB,
  groupSchema,
};
