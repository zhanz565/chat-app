import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';


export default function ChatRoom({ me, connected }) {
const [messages, setMessages] = useState([]);
const [users, setUsers] = useState([]);
const [typing, setTyping] = useState({}); // userId -> boolean


useEffect(() => {
function onMessage(msg) { setMessages(m => [...m, msg]); }
function onSystem(evt) { setMessages(m => [...m, { ...evt, system: true }]); }
function onPresence(list) { setUsers(list); }
function onTyping({ userId, isTyping }) { setTyping(t => ({ ...t, [userId]: isTyping })); }


socket.on('message', onMessage);
socket.on('system', onSystem);
socket.on('presence', onPresence);
socket.on('typing', onTyping);


return () => {
socket.off('message', onMessage);
socket.off('system', onSystem);
socket.off('presence', onPresence);
socket.off('typing', onTyping);
};
}, []);


return (
<div className="layout">
<aside>
<h3>Room: {me.room}</h3>
<UserList users={users} meId={socket.id} typing={typing} />
</aside>
<main>
<MessageList messages={messages} meId={socket.id} />
<MessageInput onSend={(text) => socket.emit('message', { room: me.room, text })}
onTyping={(isTyping) => socket.emit('typing', { room: me.room, isTyping })} />
<div className="status">{connected ? 'Connected' : 'Disconnected'}</div>
</main>
</div>
);
}