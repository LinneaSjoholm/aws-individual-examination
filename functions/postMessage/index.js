import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';
import { nanoid } from 'nanoid';

export const handler = async (event) => {
    let id;
    try {
        id = nanoid();
    } catch (error) {
        console.error("Failed to load nanoid:", error);
        return sendError(500, { error: 'Failed to generate ID' });
    }

    if (!event.body) {
        return sendError(400, { error: 'Request body is required.' });
    }

    let username, message;
    try {
        const body = JSON.parse(event.body);
        username = body.username;
        message = body.message;
    } catch (error) {
        return sendError(400, { error: 'Invalid JSON format' });
    }

    if (!username) {
        return sendError(400, { error: 'Username is required.' });
    }
    if (!message) {
        return sendError(400, { error: 'Message is required.' });
    }

    // Skapa ett nytt meddelandeobjekt
    const newMessage = {
        id: id,
        username,
        message,
        createdAt: new Date().toISOString(), // Tidsstämpel i ISO-format
    };

    try {
        await db.put({
            TableName: "message-db",
            Item: newMessage,
        }).promise();
    } catch (dbError) {
        console.error("Database Error:", dbError);
        return sendError(500, { success: false, message: "Failed to post message to the database" });
    }

    // Returnera meddelandeinformation och bekräftelsesvar
    return sendResponse(200, {
        success: true,
        username: username,
        message: newMessage, // Skicka tillbaka det nya meddelandet inklusive tidsstämpel
    });
};
