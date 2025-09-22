import { useState } from 'react';


export default function RoomPicker({ onJoin }) {
const [room, setRoom] = useState('general');
return (
<div className="card">
<h2>Join a room</h2>
<form onSubmit={e => { e.preventDefault(); if (room.trim()) onJoin(room.trim()); }}>
<input placeholder="Room (e.g. general)" value={room} onChange={e => setRoom(e.target.value)} />
<button type="submit">Join</button>
</form>
</div>
);
}