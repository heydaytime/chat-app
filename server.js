const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
const app = require(`${__dirname}/app`);

const Users = require(`${__dirname}/model/userSchema`);

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

io.on("connection", (socket) => {
  let authToken;
  let username;

  console.log(socket.id, "has joined");
  socket.on("auth-req", (data) => {
    // Setting authToken
    authToken = data;
    Users.findById(authToken).then((user) => {
      if (user === null) {
        socket.emit("auth-res", false);
        socket.disconnect();
        return;
      }
      if (!user.is_online) {
        socket.emit("auth-res", false);
        socket.disconnect();
      }
      // Setting username
      username = user.username;
      socket.emit("username", username);
      socket.emit("auth-res", true);
      io.emit("now-online", username);
    });
  });

  socket.on("send-msg", (msg) => {
    const date = new Date();
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    io.emit("recieve-msg", {
      username,
      message: msg,
      time,
    });
  });

  socket.on("disconnect", () => {
    Users.findByIdAndUpdate(
      authToken,
      { is_online: false },
      { runValidators: true }
    ).then();
  });
});
