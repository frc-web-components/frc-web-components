

var socketOpen = false;
var socket = null;
const listeners = [];

function getAddress(type) {
  if (type === 'gitpod') {
    return `wss://8080${window.location.href.substring(12)}wpilibws`;
  }
  return "ws://localhost:8080/wpilibws";
}

export function createSocket(addressType, onMessage, onClose) {

  socket = new WebSocket(getAddress(addressType));
  if (socket) {
    socket.onopen = function () {
      console.info("Socket opened");
      socketOpen = true;
      listeners.forEach(listener => {
        listener(true);
      });
    };

    socket.onmessage = function (msg) {
      var data = JSON.parse(msg.data);
      onMessage(data);
    };

    socket.onclose = function () {
      if (socketOpen) {
        console.info("Socket closed");
        socket = null;
        onClose();
        listeners.forEach(listener => {
          listener(false);
        });
      }
      // respawn the websocket
      setTimeout(() => {
        createSocket(addressType, onMessage, onClose);
      }, 300);
    };
  }
}

export function sendMsg(o) {
  if (socket) {
    var msg = JSON.stringify(o);
    socket.send(msg);
  }
}

export function isConncted() {
  return socketOpen;
}

export function addConnectionListener(listener, immediatelyNotify) {
  
  listeners.push(listener);

  if (immediatelyNotify) {
    listener(socketOpen);
  }
}
