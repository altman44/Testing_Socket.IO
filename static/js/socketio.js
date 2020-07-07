const socket = io.connect(
  location.protocol + "//" + document.domain + ":" + location.port
)

document.addEventListener("DOMContentLoaded", () => {
  
  socket.emit("join room");

  socket.on("joined", data => {
    loadUsers(data.usernames);
  });

  function loadUsers(usernames) {
    let divUser;
    let userUsername;
    const usersDiv = document.querySelector("#div-users");

    usersDiv.innerHTML = "";

    if (usernames.length) {
      usernames.forEach((username, index) => {
        divUser = document.createElement("tr");
        userUsername = document.createElement("p");

        divUser.setAttribute("class", "div-user");
        if (index == usernames.length - 1) {
          divUser.classList.add("div-user-bottom"); // to hide the last divUser border-bottom
        }
        userUsername.setAttribute("class", "p-username");
        userUsername.innerHTML = username;
        divUser.appendChild(userUsername);
        usersDiv.appendChild(divUser);
      });
    } else {
      const alertDiv = document.querySelector(".alert");
      console.log(alertDiv);
      const alertText = document.querySelector(".alert-text");
      alertDiv.setAttribute("class", "alert alert-danger");
      alertText.innerHTML = "Waiting for users...";
    }
  }
});
