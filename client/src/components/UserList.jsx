export default function UserList({ users, meId, typing }) {
    return (
    <ul className="users">
    {users.map(u => (
    <li key={u.id} className={u.id === meId ? 'me' : ''}>
    <span className="dot" /> {u.name} {typing[u.id] ? '…typing' : ''}
    </li>
    ))}
    </ul>
    );
    }