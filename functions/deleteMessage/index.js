import { sendResponse, sendError } from '../../responses/index.js';
import { db } from '../../services/db.js';

export async function handler(event, context) {
  try {

    // Get the message id
    const messageId = event.pathParameters.id;

    const getMessage = await db
      .get({
        TableName: "message-db",
        Key: {
          id: messageId,
        },
      })
      .promise();

    // Control that the message exists
    if (!getMessage.Item) {
      return sendError(404, { success: false, message: "Message not found" });
    }

    // Remove the message
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
