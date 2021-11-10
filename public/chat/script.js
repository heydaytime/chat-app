const token = localStorage.getItem("auth-token");
let username;

// Functions to make html adapt to data
const createMsgBody = (me, sender, content, creationTime) => {
  const who = me ? "message-me" : "";
  const msgWindow = document.getElementById("msg-win");

  const msgBody = ` <div class="message-body ${who}">
          <p class="message-sender">${sender}</p>
          <div class="message-content">
            <p>${content}</p>
          </div>
          <p class="message-created-at">${creationTime}</p>
        </div>`;

  msgWindow.innerHTML += msgBody;
};

const createOnlineUser = (username) => {
  const onlineUsersWindow = document.getElementById("online-users-window");
  const userJoinedBody = `<p class="users-joined">${username} Just Joined!</p>`;
  onlineUsersWindow.innerHTML += userJoinedBody;
};

const autoScroll = () => {
  const msgWindow = document.getElementById("msg-win");
  msgWindow.scrollTop = msgWindow.scrollHeight;
};

// Socket.io Connection
const socket = io("/");

socket.emit("auth-req", token);

socket.on("auth-res", (data) => {
  if (!data) {
    alert("Auth-Token invalid, please login first.");
    window.location.href = "/login";
  } else {
    alert("Welcome To Chat-Room!");
  }
});

socket.on("setup-data", (data) => {
  username = data.username;
  const messages = data.messages;

  for (const iterator of messages) {
    const { username: sender, message, time } = iterator;
    createMsgBody(username === sender, sender, message, time);
  }

  autoScroll();
});

socket.on("now-online", (data) => {
  createOnlineUser(data);
});

socket.on("recieve-msg", (data) => {
  const who = username === data.username;

  createMsgBody(who, data.username, data.message, data.time);
  autoScroll();
});

const msgBar = document.getElementById("msg-field");

msgBar.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.key === "Enter") {
    const msg = msgBar.value;
    msgBar.value = "";

    socket.emit("send-msg", msg);
  }
});
