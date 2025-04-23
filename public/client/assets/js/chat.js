import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
const formChat = document.querySelector(".chat .inner-form");
if (formChat) {
  formChat.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = formChat.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      formChat.content.value = "";
    }
  });

  socket.on("SERVER_RETURN_MESSAGE", (data) => {
    console.log("chay vao su kien server return message");
    let htmlFullName = "";
    const div = document.createElement("div");
    const myId = document
      .querySelector("[my-id-chat]")
      .getAttribute("my-id-chat");
    const chatBodyParent = document.querySelector(".chat .inner-body");
    console.log(chatBodyParent);

    if (myId == data.userId) {
      div.classList.add("inner-outgoing");
    } else {
      div.classList.add("inner-incoming");
      htmlFullName = `<div class ="inner-name"> ${data.fullname}</div>`;
    }
    let html = `
      ${htmlFullName}
      <div class = "inner-content"> ${data.content.content} </div>
    `;
    div.innerHTML = html;
    chatBodyParent.appendChild(div);
    chatBodyParent.scrollTop = chatBodyParent.scrollHeight;
  });
}
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}

// click emoji
const buttonIcon = document.querySelector(".button-icon");
const tooltip = document.querySelector(".tooltip");
if (tooltip && buttonIcon) {
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra document
    tooltip.classList.toggle("show");
  });
  // Đóng tooltip khi click bên ngoài
  document.addEventListener("click", (e) => {
    if (!tooltip.contains(e.target) && e.target !== buttonIcon) {
      tooltip.classList.remove("show");
    }
  });
}

const emoji = document.querySelector("emoji-picker");
if (emoji) {
  emoji.addEventListener("emoji-click", (e) => {
    console.log(e.detail.unicode);
    const icon = e.detail.unicode;
    const input = document.querySelector(".inner-foot .inner-form input");
    input.value = input.value + icon;
  });
}
// end click emoji

// selectionrange
