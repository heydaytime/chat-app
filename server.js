const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const app = require(`${__dirname}/app`);

const Users = require(`${__dirname}/model/user`);
const Chat = require(`${__dirname}/model/chat`);

// Temp Variables
let usersOnline = 0;

// HTTPS SERVER
const https = require("https");
const fs = require("fs");

const httpsOptions = {
  key: fs.readFileSync(`${__dirname}/certificates/key.pem`),
  cert: fs.readFileSync(`${__dirname}/certificates/cert.pem`),
  ca: [fs.readFileSync(`${__dirname}/certificates/bundle.crt`)],
};

const server = https.createServer(httpsOptions, app);
server.listen(443, () => {
  console.log(`Server Started Listening On Port 443...`);
});

const io = require("socket.io")(server);

io.on("connection", async (socket) => {
  let authToken;
  let username;

  await socket.on("auth-req", async (data) => {
    authToken = data;
    const user = await Users.findById(authToken);

    if (user === null || !user.is_online) {
      socket.emit("auth-res", false);
      socket.disconnect();
    } else {
      socket.emit("auth-res", true);
      username = user.username;

      usersOnline++;

      io.emit("now-online", {
        username,
        usersOnline,
      });

      const messages = await Chat.find().select("-__v").select("-_id");

      const setupData = {
        username,
        messages,
      };

      socket.emit("setup-data", setupData);
    }

    // Making the users unavailable for another free login

    await Users.findByIdAndUpdate(
      authToken,
      { is_online: false },
      { runValidators: true }
    );
  });

  socket.on("send-msg", (message) => {
    const time = new Date().toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "numeric",
    });

    const messageObj = {
      username,
      message,
      time,
    };

    io.emit("recieve-msg", messageObj);

    Chat.create(messageObj).then();
  });

  socket.on("disconnect", async () => {
    // return if the user has an invalid auth token and don't update the users
    if (!username) return;

    // Setting the number of online users now
    usersOnline--;

    io.emit("now-offline", {
      username,
      usersOnline,
    });
  });
});
