import { useEffect, useRef, useState } from 'react';


export default function MessageInput({ onSend, onTyping }) {
const [text, setText] = useState('');
const typingRef = useRef(false);
const timeoutRef = useRef(null);


useEffect(() => () => clearTimeout(timeoutRef.current), []);


function handleType(v) {
setText(v);
if (!typingRef.current) {
typingRef.current = true;
onTyping(true);
}
clearTimeout(timeoutRef.current);
timeoutRef.current = setTimeout(() => {
typingRef.current = false;
onTyping(false);
}, 1000);
}


return (
<form className="input" onSubmit={e => { e.preventDefault(); if (text.trim()) { onSend(text.trim()); setText(''); onTyping(false); } }}>
<input value={text} onChange={e => handleType(e.target.value)} placeholder="Type a message…" />
<button type="submit">Send</button>
</form>
);
}