const GroupDB = require("../model/groupSchema");
const Users = require(`${__dirname}/../model/userSchema`);

exports.signup = async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await Users.findOne(req.body);
    if (user === null) throw "Invalid Credentials";

    res.status(201).json({
      status: "success",
      userid: user.id,
    });

    await Users.findByIdAndUpdate(
      user.id,
      {
        is_online: true,
      },
      { runValidators: true }
    );
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
