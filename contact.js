
document.addEventListener("DOMContentLoaded", () => {
  const meetingId = "{{ meeting.id }}";  // Django template variable
  const username = "{{ user.username }}"; // Django template variable

  const videoContainer = document.createElement("div");
  videoContainer.id = "videos";
  videoContainer.className = "absolute inset-0 flex flex-wrap gap-2 p-2";
  document.querySelector(".video-container").appendChild(videoContainer);

  let localStream;
  const peers = {};
  const socket = new WebSocket(`wss://http://127.0.0.1:5500/ws/meet/${meetingId}/`);

  // Initialize local camera/mic
  async function initLocalStream() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const myVideo = document.createElement("video");
      myVideo.srcObject = localStream;
      myVideo.muted = true;
      myVideo.autoplay = true;
      myVideo.playsInline = true;
      myVideo.className = "w-32 h-32 rounded-lg";
      videoContainer.appendChild(myVideo);
    } catch (err) {
      console.error("Failed to get media:", err);
    }
  }

  initLocalStream();

  // Handle incoming WebSocket messages
  socket.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    const { type, from, signal, username: peerName, message } = data;

    if (type === "new-participant") {
      const peer = new SimplePeer({ initiator: true, trickle: false, stream: localStream });
      peer.on("signal", sig => socket.send(JSON.stringify({ type: "signal", to: from, signal: sig })));
      peer.on("stream", stream => addRemoteVideo(stream, from, peerName));
      peers[from] = peer;
    }

    if (type === "signal" && peers[from]) {
      peers[from].signal(signal);
    }

    if (type === "leave") {
      removePeerVideo(from);
      delete peers[from];
    }

    if (type === "chat" && peerName !== username) {
      addChatMessage(peerName, message, "peer");
    }
  };

  function addRemoteVideo(stream, id, peerName) {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.id = `peer-${id}`;
    video.autoplay = true;
    video.playsInline = true;
    video.className = "w-32 h-32 rounded-lg";
    videoContainer.appendChild(video);
  }

  function removePeerVideo(id) {
    const video = document.getElementById(`peer-${id}`);
    if (video) video.remove();
  }

  // Chat
  const chatBox = document.createElement("div");
  chatBox.id = "chat-box";
  chatBox.className = "absolute top-4 right-4 w-64 h-80 bg-gray-800/80 p-2 rounded overflow-y-auto text-sm";
  document.body.appendChild(chatBox);

  const chatInput = document.createElement("input");
  chatInput.id = "chat-input";
  chatInput.className = "absolute bottom-4 right-4 w-52 p-2 rounded text-black";
  chatInput.placeholder = "Type a message...";
  document.body.appendChild(chatInput);

  const chatSend = document.createElement("button");
  chatSend.id = "chat-send";
  chatSend.innerText = "Send";
  chatSend.className = "absolute bottom-4 right-4 ml-56 px-3 py-2 bg-blue-600 text-white rounded";
  document.body.appendChild(chatSend);

  function addChatMessage(sender, msg, type="self") {
    const div = document.createElement("div");
    div.className = type === "self" ? "text-right text-green-400" : "text-left text-white";
    div.innerHTML = `<b>${sender}:</b> ${msg}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  chatSend.addEventListener("click", () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    socket.send(JSON.stringify({ type: "chat", username, message: msg }));
    addChatMessage("You", msg, "self");
    chatInput.value = "";
  });

  // Leave meeting
  window.addEventListener("beforeunload", () => {
    socket.send(JSON.stringify({ type: "leave", username }));
    localStream.getTracks().forEach(track => track.stop());
  });
});

