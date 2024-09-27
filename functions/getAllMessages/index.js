import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export async function handler(event, context) {
    try {
        const result = await db.scan({
            TableName: 'message-db'
        }).promise();

        console.log('Get all message operation successful:', result);
        return sendResponse(200, { success: true, message: result.Items });
    } catch (error) {
        console.error('Error:', error);
        return sendError(500, { success: false, message: 'Could not fetch message' });
    }
}
