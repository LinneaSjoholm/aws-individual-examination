import React, { useState } from 'react';
import '../style/Form.css';

const Form = ({ onNewMessage }) => {
    const [username, setUsername] = useState('');
    const [tip, setTip] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        try {
            const newMessage = {
                username,
                message: tip,
                createdAt: new Date().toISOString(), // Se till att tidsstämpeln skapas här
            };

            await onNewMessage(newMessage); // Anropa onNewMessage med det nya meddelandet

            // Rensa formuläret
            setUsername('');
            setTip('');
        } catch (error) {
            console.error('Fel vid att skicka meddelande:', error);
            setError('Ett fel inträffade, försök igen senare.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div>
                <label htmlFor="username">Ange användarnamn</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="tip">Skriv ditt tips här</label>
                <textarea
                    id="tip"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    required
                ></textarea>
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Skickar...' : 'Publicera tips'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Form;
