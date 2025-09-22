import { useState } from 'react';


export default function Login({ onSubmit }) {
const [name, setName] = useState('');
return (
<div className="card">
<h2>Choose a username</h2>
<form onSubmit={e => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); }}>
<input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
<button type="submit">Continue</button>
</form>
</div>
);
}