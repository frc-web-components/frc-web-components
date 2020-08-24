

const address = "ws://localhost:8080/ws";
var socketOpen = false;
var socket = null;

export function createSocket(onMessage, onClose) {

  socket = new WebSocket(address);
  if (socket) {
    socket.onopen = function () {
      console.info("Socket opened");
      socketOpen = true;
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
      }
      // respawn the websocket
      setTimeout(() => {
        createSocket(onMessage, onClose);
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