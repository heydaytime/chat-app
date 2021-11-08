const form = document.getElementById("reg-form");
form.addEventListener("submit", registerUser);

async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const result = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());

  if (result.status === "success") {
    alert("User succesfully created!");
    window.location.href = "https://heyday.dev/login";
  } else {
    alert(JSON.stringify(result.error));
  }
}
