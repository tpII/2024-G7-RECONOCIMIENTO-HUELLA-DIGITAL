import { useState } from 'react';

export default function UsersFingerprint() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5050/usersFingerprint/startRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(`Registration started. Assigned ID: ${data.idFingerprint}`);
            } else {
                setMessage('Error starting registration');
            }
        } catch {
            setMessage('Failed to connect to the server');
        }
    };

    return (
        <>
            <h1>Register Fingerprint</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </>
    );
}