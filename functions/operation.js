require('dotenv').config();
const credentials = require('../panty-shop-agent-ecbs.json')
const { SessionsClient } = require('dialogflow');

const projectId = credentials.project_id

const config = {
    credentials: {
      private_key: credentials.private_key_id,
      client_email: credentials.client_email
    }
  };
  console.log(JSON.stringify(config, undefined, 2))

let dialogflowRequest = async (incomingMessageContent, recipientPhone) => {
    // Create a new session ID using the Whatsapp phone number
    const sessionId = recipientPhone.split('@')[0];
    // Create a new Dialogflow session client using the service account key
    const sessionClient = new SessionsClient(config);
    const session = sessionClient.sessionPath(projectId, sessionId);
    const dialogflowResponse = await sessionClient.detectIntent({
    session,
    queryInput: {
        text: {
        text: incomingMessageContent,
        languageCode: 'en-US',
            },
        },
    });
    const { fulfillmentText } = dialogflowResponse[0].queryResult;
    console.log("+++dialogflowResponse++++")
    console.log(dialogflowResponse)
    const { action } = dialogflowResponse[0].queryResult;
    const { parameters } = dialogflowResponse[0].queryResult

    return {
        "fulfillmentText": fulfillmentText,
        "action": action,
        "parameters": parameters
    }
}

module.exports = {
    dialogflowRequest,
}