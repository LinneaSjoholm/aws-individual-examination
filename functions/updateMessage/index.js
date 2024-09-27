import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export async function handler(event, context) {
    const messageId = event.pathParameters.id;
    let newMessage;

    try {
        const body = JSON.parse(event.body); // Parse the request body
        newMessage = body.message; // Get the new message text from the request body
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*", // Byt till din specifika domän för produktion
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({ error: 'Invalid JSON format' }),
        };
    }

    // Validate the input
    if (!newMessage) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*", // Byt till din specifika domän för produktion
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({ error: 'New message text is required.' }),
        };
    }

    try {
        // Get the existing message to ensure it exists
        const getMessage = await db
            .get({
                TableName: 'message-db',
                Key: {
                    id: messageId, // Use the ID to find the message
                },
            })
            .promise();

        // If the message doesn't exist, return an error
        if (!getMessage.Item) {
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*", // Byt till din specifika domän för produktion
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
                },
                body: JSON.stringify({ success: false, message: 'Message not found' }),
            };
        }

        // Update the message in the database
        await db
            .update({
                TableName: 'message-db',
                Key: { 
                    id: messageId 
                }, // Key for the message to update
                UpdateExpression: 'set message = :newMessage, updatedAt = :updatedAt', // Update the message and set an updated timestamp
                ExpressionAttributeValues: {
                    ':newMessage': newMessage,
                    ':updatedAt': new Date().toISOString(),
                },
                ReturnValues: 'ALL_NEW', // Return the updated values
            })
            .promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Byt till din specifika domän för produktion
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({
                success: true,
                message: 'Message successfully updated',
            }),
        };
    } catch (error) {
        console.error('Error updating message:', error); // Log the error
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*", // Byt till din specifika domän för produktion
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({ success: false, message: 'Could not update message' }),
        };
    }
}
