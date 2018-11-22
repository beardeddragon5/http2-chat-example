'use strict'

let source = null;
let username = null;

const chatOther = (user, message) => `
<div class="container">
  <div class="row">
    <figure class="col-2 text-center">
      <img src="https://randomuser.me/api/portraits/thumb/women/${user.charCodeAt(0)}.jpg" alt="User Avatar" class="mx-auto rounded-circle border border-dark" />
      <figcaption class="primary-font mx-auto">${user}</figcaption>
    </figure>
    <div class="col-10">
      ${message}
    </div>
  </div>
</div>`;

const chatMe = (user, message) => `
<div class="container">
  <div class="row">
    <div class="col-10">
      ${message}
    </div>
    <figure class="col-2 text-center">
      <img src="https://randomuser.me/api/portraits/thumb/men/${user.charCodeAt(0)}.jpg" alt="User Avatar" class="rounded-circle border border-dark" />
      <figcaption class="primary-font">${user}</figcaption>
    </figure>
  </div>
</div>`;

const chatStatus = (message) => `<div class="chat-body clearfix">
<div class="header"><small class=" text-muted">${message}</small></div></div>`;

window.onload = () => {
  if (!username) username = generateName(minLength, maxLength);
  if (!source) enterChat();
  if (source) loadUsers();
}

window.onunload = () => {
  source.close();
  document.cookie = `user=`;
}

window.onkeypress = (ev) => ev.code === 'Enter' ? sendMsg() : undefined;

function sendMsg() {
  const input = document.getElementById('msg');
  if (input.value.trim() === '') {
    return;
  }
  document.cookie = `user=${username}`;
  fetch('/message', { method: "POST", credentials: 'include', headers: { "content-type": "application/json" }, body : JSON.stringify({ msg: input.value }) })
    .catch(err => console.log(err))
  document.getElementById('msg').value = '';
}

function statusMessage(message) {
  const chat = document.getElementById('chat');
  const li = document.createElement("li");
  li.classList.add("clearfix");
  li.innerHTML = chatStatus(message);
  chat.appendChild(li);
  li.scrollIntoView();
}

function chatMessage(left, username, message) {
  const chat = document.getElementById('chat');
  const li = document.createElement("li");
  li.classList.add("clearfix");
  li.classList.add(left ? "left" : "right");
  if (left) {
    li.innerHTML = chatOther(username, message);
  } else {
    li.innerHTML = chatMe(username, message);
  }
  chat.appendChild(li);
  li.scrollIntoView();
}

function loadUsers() {
  fetch('/users')
    .then(response => response.json())
    .then(usernames => statusMessage(`${usernames.length} user in chat`));
}

function enterChat() {
  document.cookie = `user=${username}`;

  source = new EventSource("/register");
  source.onerror = e => setTimeout(() => location.reload(), 1000);

  source.addEventListener("info", (e) => {
    const m = JSON.parse(e.data);
    chatMessage(m.sender !== username, m.sender, m.msg);
  }, false);

  source.addEventListener("oper", (e) => {
    const event = JSON.parse(e.data);
    switch (event.oper) {
      case 'del':
        statusMessage(`${event.user} left chat`);
        break;
      case 'add':
        statusMessage(`${event.user} joined chat`);
        break;
    }
  }, false);

}
