require('dotenv').config();
const credentials = require('./panty-shop-agent-ecbs.json');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const projectId = credentials.project_id

const sessionId = uuid.v4();

  //console.log(JSON.stringify(config, undefined, 2))

let dialogflowRequest = async(msg)=>{
    // Create a session
    const sessionClient = new dialogflow.SessionsClient({keyFilename:"././panty-shop-agent-ecbs.json"})
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    )

    // Text query request
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: msg,
                languageCode: 'en-US'
            }
        }
    }

    // Send request and log result
    const response = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = response[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else{
        console.log('  No intent matched.');
    }
    const { fulfillmentText } = result;
    const { action } = result;
    const { parameters } =result;

    return {
        "fulfillmentText": fulfillmentText,
        "action": action,
        "parameters": parameters
    }
}


module.exports = {
    dialogflowRequest,
}