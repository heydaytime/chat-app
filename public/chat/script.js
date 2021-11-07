const token = localStorage.getItem("auth-token");
let username;

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

const socket = io("https://heyday.dev");

socket.on("connect", () => {
  console.log("my socketid", socket.id);
  console.log("my userid", token);
});

socket.emit("auth-req", token);

socket.on("auth-res", (data) => {
  if (!data) {
    alert("Auth-Token invalid, please login first.");
    window.location.href = "https://heyday.dev/login";
  } else {
    alert("Welcome To Chat-Room!");
  }
});

socket.on("username", (data) => {
  username = data;
});

socket.on("now-online", (data) => {
  createOnlineUser(data);
});

socket.on("recieve-msg", (data) => {
  const who = username === data.username;

  console.log(data.username);
  console.log(username);

  createMsgBody(who, data.username, data.message, data.time);
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
