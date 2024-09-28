import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export async function handler(event, context) {
  try {

    
    const messageId = event.pathParameters.id;

    const getMessage = await db
      .get({
        TableName: "message-db",
        Key: {
          id: messageId,
        },
      })
      .promise();

    
    if (!getMessage.Item) {
      return sendError(404, { success: false, message: "Message not found" });
    }

    
    await db
      .delete({
        TableName: "message-db",
        Key: {
          id: messageId,
        },
      })
      .promise();

    return sendResponse(200, {
      success: true,
      message: "Message successfully deleted",
    });
  } catch (error) {
    return sendError(500, {
      success: false,
      message: "Could not delete message",
    });
  }
}
