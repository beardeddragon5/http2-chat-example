'use strict'

console.log('Script loaded');
let source = null;
let username = '';
let userList = undefined;

var starts = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'r', 'p', 's', 't', 'u'];
var speakable = {
  a: ['b', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u'],
  b: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  c: ['h'],
  d: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  e: ['f', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'u'],
  f: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  g: ['a', 'e', 'i', 'l', 'o', 'u'],
  h: ['a', 'e', 'i', 'o', 'u'],
  i: ['b', 'f', 'k', 'l', 'm', 'n', 'p', 'r', 'h', 's', 't'],
  j: ['a', 'e', 'i', 'o', 'u'],
  k: ['a', 'e', 'i', 'l', 'o', 'u'],
  l: ['a', 'e', 'i', 'o', 'u'],
  m: ['a', 'e', 'i', 'j', 'o', 'u'],
  n: ['a', 'e', 'i', 'o', 'u'],
  o: ['b', 'c', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't'],
  p: ['a', 'e', 'i', 'l', 'o', 'r', 'u'],
  r: ['a', 'i', 'e', 'o', 'u'],
  s: ['a', 'e', 'c', 'i', 'o', 'u', 't'],
  t: ['a', 'e', 'i', 'o', 'u'],
  u: ['b', 'g', 'i', 'k', 'n', 'm', 'p', 'r', 's', 't']
};

var minLength = 5;
var maxLength = 8;

function generateName(minlength, maxlength) {
  var length = minlength + Math.random() * (maxlength - minlength);
  var lastChar = starts[parseInt(Math.random() * starts.length, 10)];

  var projectName = lastChar.toUpperCase();
  for (var i = 0; i < length; i++) {
     var nextChars = speakable[lastChar];
     lastChar = nextChars[parseInt(Math.random() * nextChars.length, 10)];
     projectName += lastChar;
  }
  return projectName;
}

const chatOther = (username, message) => `
<span class="chat-img pull-left">
  <img src="http://placehold.it/50/55C1E7/fff&text=${username.substring(0, 1)}" alt="User Avatar" class="img-circle" />
</span>
<div class="chat-body clearfix">
    <div class="header">
        <strong class="primary-font">${username}</strong>
    </div>
    <p>
        ${message}
    </p>
</div>
`;

const chatMe = (username, message) => `
<span class="chat-img pull-right">
  <img src="http://placehold.it/50/FA6F57/fff&text=ME" alt="User Avatar" class="img-circle" />
</span>
<div class="chat-body clearfix">
    <div class="header">
        <small class=" text-muted">&nbsp;</small>
        <strong class="pull-right primary-font">${username}</strong>
    </div>
    <p>
        ${message}
    </p>
</div>
`;

const chatMessage = (message) => `
<div class="chat-body clearfix">
    <div class="header">
        <small class=" text-muted">${message}</small>
    </div>
</div>
`;

window.onload = () => {
  username = generateName(minLength, maxLength);
  // document.getElementById("userName").innerHTML = username;

  if (!source) enterChat();
  if (source) loadUsers();
}

window.onkeypress = (ev) => {
  if (ev.code === 'Enter') {
    sendMsg();
  }
};

const sendMsg = () => {
  const input = document.getElementById('msg');
  fetch('/message', { method: "POST", credentials: 'include', headers: { "content-type": "application/json" }, body : JSON.stringify({ msg: input.value }) })
  .catch(err => console.log(err))
  document.getElementById('msg').value = '';
}

const statusMessage = (message) => {
  const chat = document.getElementById('chat');
  const li = document.createElement("li");
  li.classList.add("clearfix");
  li.innerHTML = chatMessage(message);
  chat.appendChild(li);
}

const loadUsers = () => {
  fetch('/users')
  .then(response => response.json())
  .then(json => {
    const list = json.userList.filter(name => name !== username);
    if (!userList && list.length > 0) {
      statusMessage(`${json.userList.length} user in chat`);
      userList = list;
    } else {
      userList.forEach(user => {
        if (!list.find(name => name === user)) {
          statusMessage(`${user} left chat`);
        }
      })
      list.forEach(user => {
        if (!userList.find(name => name === user)) {
          statusMessage(`${user} joined chat`);
        }
      })
      userList = list;
    }
  });
}

const quitChat = () => {
  source.close();
  console.log('Chat closed');
  document.cookie = `user=`;
  // document.getElementById('userList').innerHTML = '';
  // document.getElementById('chat').innerHTML = '';
}

const enterChat = () => {
  console.log('start sse')

  document.cookie = `user=${username}`;

  source = new EventSource("/register");

  source.onerror = (e) => {
    console.log("EventSource failed", e);
  };

  source.addEventListener("info", (e) => {
    const chat = document.getElementById('chat');
    const li = document.createElement("li");
    li.classList.add("clearfix");

    const message = JSON.parse(e.data);
    if (message.sender !== username) {
      li.classList.add("left");
      li.innerHTML = chatOther(message.sender, message.msg);
    } else {
      li.classList.add("right");
      li.innerHTML = chatMe(message.sender, message.msg);
    }

    chat.appendChild(li);
    console.log('sse info', e.data)
  }, false);

  source.addEventListener("oper", (e) => {
    loadUsers();
    console.log('sse oper', e.data)
  }, false);

}
