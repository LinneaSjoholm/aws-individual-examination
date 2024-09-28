import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export async function handler(event, context) {
    const messageId = event.pathParameters.id;
    let newMessage;

    try {
        const body = JSON.parse(event.body);
        newMessage = body.message;
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({ error: 'Invalid JSON format' }),
        };
    }

    
    if (!newMessage) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({ error: 'New message text is required.' }),
        };
    }

    try {
        
        const getMessage = await db
            .get({
                TableName: 'message-db',
                Key: {
                    id: messageId,
                },
            })
            .promise();

        
        if (!getMessage.Item) {
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
                },
                body: JSON.stringify({ success: false, message: 'Message not found' }),
            };
        }

        
        await db
            .update({
                TableName: 'message-db',
                Key: { 
                    id: messageId 
                }, 
                UpdateExpression: 'set message = :newMessage, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':newMessage': newMessage,
                    ':updatedAt': new Date().toISOString(),
                },
                ReturnValues: 'ALL_NEW',
            })
            .promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({
                success: true,
                message: 'Message successfully updated',
            }),
        };
    } catch (error) {
        console.error('Error updating message:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT"
            },
            body: JSON.stringify({ success: false, message: 'Could not update message' }),
        };
    }
}
