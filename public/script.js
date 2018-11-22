'use strict'

let source = null;
let username = null;

const chatOther = (user, message) => `<span class="chat-img pull-left">
<img src="https://randomuser.me/api/portraits/thumb/women/${user.charCodeAt(0)}.jpg" alt="User Avatar" class="img-circle" /></span>
<div class="chat-body clearfix"><div class="header"><strong class="primary-font">${user}</strong></div><p>${message}</p></div>`;

const chatMe = (user, message) => `<span class="chat-img pull-right">
<img src="https://randomuser.me/api/portraits/thumb/men/${user.charCodeAt(0)}.jpg" alt="User Avatar" class="img-circle" /></span>
<div class="chat-body clearfix"><div class="header">
<small class=" text-muted">&nbsp;</small><strong class="pull-right primary-font">${user}</strong></div><p>${message}</p></div>`;

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
  source.onerror = e => statusMessage('EventSource error:' + JSON.stringify(e));

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
