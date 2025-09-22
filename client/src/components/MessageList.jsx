export default function MessageList({ messages, meId }) {
    return (
    <ul className="messages">
    {messages.map(m => (
    <li key={m.id || Math.random()} className={m.system ? 'system' : (m.from === meId ? 'me' : 'other')}>
    <span className="time">{new Date(m.at).toLocaleTimeString()}</span>
    <span className="text">{m.text}</span>
    </li>
    ))}
    </ul>
    );
    }