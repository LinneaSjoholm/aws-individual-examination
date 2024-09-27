import React, { useState, useEffect } from 'react';
import Form from './Form';
import Modal from './Modal';
import '../style/MessageBoard.css';

const MessageBoard = () => {
    const [messages, setMessages] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");

    // Funktion för att hämta alla tips från backend
    const fetchMessages = async () => {
        try {
            const response = await fetch('https://d1mwgd39bf.execute-api.eu-north-1.amazonaws.com/api/messages');
            const data = await response.json();

            // Kontrollera om response är framgångsrik
            if (data.success) {
                // Sortera meddelandena efter createdAt för att visa dem i ordning
                const sortedMessages = data.message.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setMessages(sortedMessages);
            } else {
                console.error("Fel vid hämtning av meddelanden:", data.message);
            }
        } catch (error) {
            console.error("Fel vid fetch:", error);
        }
    };

    useEffect(() => {
        fetchMessages(); // Hämta tips vid komponentens mount
    }, []);

    // Hantera nya tips när formuläret skickas
    const handleNewMessage = async (newMessage) => {
        try {
            const response = await fetch('https://d1mwgd39bf.execute-api.eu-north-1.amazonaws.com/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMessage), // Skicka meddelandet som JSON
            });

            const data = await response.json();

            if (data.success) {
                // Lägg till det nya meddelandet i listan och sortera dem igen
                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages, { ...data.message, createdAt: newMessage.createdAt }];
                    const sortedMessages = updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    
                    // Returnerar alla för att undvika dubbletter
                    return sortedMessages; 
                });
            } else {
                console.error("Fel vid att posta meddelande:", data.message);
            }
        } catch (error) {
            console.error("Fel vid fetch:", error);
        }
    };

    // Öppna redigeringsmodal
    const openEditModal = (message) => {
        setCurrentMessage(message);
        setEditedMessage(message.message);
        setEditModalOpen(true);
    };

    // Redigera meddelande
    const handleEditMessage = async () => {
        if (currentMessage) {
            try {
                const response = await fetch(`https://d1mwgd39bf.execute-api.eu-north-1.amazonaws.com/api/message/${currentMessage.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: editedMessage }), // Skicka den nya meddelandetexten
                });

                const data = await response.json();

                if (data.success) {
                    // Uppdatera meddelandet i lokal state
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id === currentMessage.id ? { ...msg, message: editedMessage } : msg
                        )
                    );
                } else {
                    console.error("Fel vid att uppdatera meddelande:", data.message);
                }
            } catch (error) {
                console.error("Fel vid fetch:", error);
            }
        }
        setEditModalOpen(false);
    };

    // Öppna borttagningsmodal
    const openDeleteModal = (message) => {
        setCurrentMessage(message);
        setDeleteModalOpen(true);
    };

    // Ta bort meddelande
    const handleDeleteMessage = async () => {
        if (currentMessage) {
            try {
                const response = await fetch(`https://d1mwgd39bf.execute-api.eu-north-1.amazonaws.com/api/message/${currentMessage.id}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    // Ta bort meddelandet från lokal state
                    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== currentMessage.id));
                } else {
                    console.error("Fel vid att ta bort meddelande:", data.message);
                }
            } catch (error) {
                console.error("Fel vid fetch:", error);
            }
        }
        setDeleteModalOpen(false);
    };

    // Funktion för att växla mellan visningar
    const toggleShowAll = () => {
        setShowAll(prevShowAll => !prevShowAll);
    };

    return (
        <div className="message-board">
            <h1>Tips-board</h1>

            {/* Flytta knappen för att visa alla inlägg här */}
            <button onClick={toggleShowAll} style={{ marginBottom: '10px' }}>
                {showAll ? 'Dölj inlägg' : 'Visa alla inlägg'}
            </button>

            <ul>
                {showAll ? (
                    messages.map((msg) => (
                        <li key={msg.id}>
                            <small className="timestamp">{new Date(msg.createdAt).toLocaleString()}</small>
                            <span>{msg.username}:</span> {msg.message}
                            {/* Redigera och Ta bort knappar */}
                            <button onClick={() => openEditModal(msg)}>Redigera</button>
                            <button onClick={() => openDeleteModal(msg)}>Ta bort</button>
                        </li>
                    ))
                ) : (
                    messages.length > 0 && (
                        <li key={messages[messages.length - 1].id}>
                            <small className="timestamp">{new Date(messages[messages.length - 1].createdAt).toLocaleString()}</small>
                            <span>{messages[messages.length - 1].username}:</span> {messages[messages.length - 1].message}
                            {/* Redigera och Ta bort knappar */}
                            <button onClick={() => openEditModal(messages[messages.length - 1])}>Redigera</button>
                            <button onClick={() => openDeleteModal(messages[messages.length - 1])}>Ta bort</button>
                        </li>
                    )
                )}
            </ul>

            {/* Formuläret för nya meddelanden */}
            <Form onNewMessage={handleNewMessage} />

            {/* Redigeringsmodal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Redigera meddelande"
                onConfirm={handleEditMessage}
            >
                <textarea 
                    value={editedMessage} 
                    onChange={(e) => setEditedMessage(e.target.value)} 
                    rows="4" 
                    style={{ width: '100%' }}
                />
            </Modal>

            {/* Borttagningsmodal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Bekräfta borttagning"
                onConfirm={handleDeleteMessage}
            >
                <p>Är du säker på att du vill ta bort detta meddelande?</p>
            </Modal>
        </div>
    );
};

export default MessageBoard;
