import { useEffect, useState } from 'react';
import { socket } from './lib/socket';
import Login from './components/Login';
import RoomPicker from './components/RoomPicker';
import ChatRoom from './components/ChatRoom';


export default function App() {
const [connected, setConnected] = useState(false);
const [me, setMe] = useState({ name: '', room: '' });


useEffect(() => {
function onConnect() { setConnected(true); }
function onDisconnect() { setConnected(false); }
socket.on('connect', onConnect);
socket.on('disconnect', onDisconnect);
return () => {
socket.off('connect', onConnect);
socket.off('disconnect', onDisconnect);
};
}, []);


if (!me.name) return <Login onSubmit={(name) => setMe({ ...me, name })} />;
if (!me.room) return <RoomPicker onJoin={(room) => {
setMe({ ...me, room });
if (!socket.connected) socket.connect();
socket.emit('join', { name: me.name, room });
}} />;


return <ChatRoom me={me} connected={connected} />;
}