function switchRoom(roomId) {
  if (!roomId || this.roomId === roomId) return;

  this.roomId = roomId;
  this.messages = [];
  this.fetchMessages();
}

function getRoomName(roomId) {
  const room = this.rooms.find(r => r.roomId === roomId);
  return room ? room.name : null;
}

async function fetchMessages() {
  if (!this.accessToken || !this.roomId) return;

  try {
    const url =
      `https://matrix.org/_matrix/client/r0/rooms/${encodeURIComponent(this.roomId)}` +
      `/messages?limit=50&dir=b`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });

    const data = await res.json();

    if (!data.chunk) {
      this.messages = [];
      return;
    }

    const msgs = data.chunk
      .filter(ev => ev.type === 'm.room.message' && ev.content && ev.content.body)
      .map(ev => ({
        id: ev.event_id,
        sender: ev.sender,
        body: ev.content.body,
        ts: ev.origin_server_ts || Date.now()
      }))
      .sort((a, b) => a.ts - b.ts);

    this.messages = msgs;
  } catch (e) {
    console.error('Fetch messages error:', e);
    this.error = 'Error loading messages: ' + e.message;
  }
}

async function sendMessage() {
  if (!this.newMessage || !this.newMessage.trim() || !this.accessToken || !this.roomId) {
    return;
  }

  const body = this.newMessage.trim();

  try {
    const txnId = Date.now(); 

    const url =
      `https://matrix.org/_matrix/client/r0/rooms/${encodeURIComponent(this.roomId)}` +
      `/send/m.room.message/${txnId}`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({
        msgtype: 'm.text',
        body
      })
    });

    const data = await res.json();

    if (data.event_id) {
      this.newMessage = '';
      await this.fetchMessages();
    } else {
      console.error('Send message failed:', data);
      this.error = 'Send message failed: ' + (data.error || 'Unknown error');
    }
  } catch (e) {
    console.error('Send message error:', e);
    this.error = 'Error sending message: ' + e.message;
  }
}
