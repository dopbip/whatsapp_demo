require('dotenv').config();
const credentials = require('../panty-shop-agent-ecbs.json');
const { SessionsClient } = require('dialogflow');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const { language } = require('googleapis/build/src/apis/language');

const projectId = credentials.project_id

const sessionId = uuid.v4();
const config = {
    credentials: {
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyJwaCu7JdlJBK\nza5vFAjF+e/VwCXQm4XGlg3jprzaFkU+GuLxBOy3vecPA948Mwbb8q3D6i3nY+hg\niDnsm3YkmfWpkeYizkNAb5L3eT50MRnm4VjFeIP5AGghb0OyQv984IG7h5zvHluA\nxWoLxd8JyyfKIPr87E0cA7JXwit5aNGORvMpWekcfY/UFHFmRCN3yO948sgu9H8x\nC3o8Vw/0cGYWdN1MHirDRChtybxK3w+sjZuh/uceIDIMmxPqipnyQu2B+eDgM5de\nP07/z9G9coVsgVx/yEM222Cr0H+0pHREIBvkRGgf+JLzd/qybSvRuDKnH0imwo6l\nTxhQkckFAgMBAAECggEAEEIpgPLaQ1oUlQ8SVUbRyieWML65dMFMwyPcnqMP5yNT\nLGjNv0tAw0AMfz1OIdZSUO5j11Ze3BgtE+o6xxIlBRAb8F7FTvXeA1prYjRpc7cr\ncvur21G1UZss5ag+2Fzu7hmbHV8x/kyZ8zWRCQQE5+LnfbXm0gBKxTy9IO8ygoDc\nJr3C7UASdy8qpkePfJcITUzqCuBRjE2vHrL7++JqDbW6cp12GxP6l9e1ir4MJUid\ns0uZ3JDMyBlaVuxUOxKB31ee0ozDUbYYcMVuhWUFpin2BCAbgcmZTyhyh0aw6W6R\nmjkK8q8Gss2VrSjsWN/dt8rRAxpRIKlGTP9L+A6uAQKBgQDwShdnrONaBk8gBBlw\nGDfOOCU1YYMZW/zD6GV3sHWYisLegTCs47smbOjO8TfBlW3liZYNn+7XchZ5yYzm\nOJOPgdd7zNQlxXJ2L4t1i8OLTSPzFDGBgRdUTPIg3PsWK7WJ+kaQtZKYCaLLIO67\nU8oLr4ZeZgbTBO4djhL/NFpxhQKBgQC9zOZTEocXvj0VDXpv8TAeyjlOUxZLMl0n\nmYpJpYCQnjSbTNlS7RHru9PzIJAkxOdijb7gvNLA65fux7avJ5i/+EC4c85gjrsL\nkrGnbMqHcoGrd1aXVD+Ly1Fmg1I3JsRpP62UGNLh8W1t/dOHzLchsGdMJY9EwMI1\nq27n313RgQKBgQDG2OmJeD8kjrgIDJxocQIte7T++dUdtUv1a2ocpECMnbgpncuE\nJ2kGoXX/WwsC/f/VxggQ+lsSm20SF8Kr+gHS7mY+IwEkyMKyHyJPgfuuWYX4cKuP\nOh7uOkbc/0Ih1MYEisK+miPYAZFge75T80DubrDJibD4C8ppVttNqit2aQKBgAbJ\nF4bqx6eipn5lL/ZmkgjXw/q337kqgMgUpiwB3bnN3iWbNr3POe/KlEZB6MVXwMn2\nNVfFiGdbROBFhZN3f++FCZNOmJc9IxTD1tQcgJUdE+O0bYUVfvwZdbyLf1n3adg1\nbZg41vk672WaSIC3YeizbM39HcUgexD+IwXpJ2qBAoGAScPVCT4ABcf4FOtDoz7c\nmweqUAK5w+1hzehNfsl7mSmuAmXwjqtZHgv6uVPklXEOPpC4LxobCJcRD9pG/oTh\nJTqTJ4J29SrC8Lcbq45OwteBPV9UD22z66rM3oiq7rE+W/rtTkmyK8PS6KeOy+Gn\nH0SVS6ietpXbBO2iT4XsPJs=\n-----END PRIVATE KEY-----\n", //credentials.private_key_id,
      client_email: credentials.client_email
    }
  };
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
//   let dialogflowRequest2 = async (incomingMessageContent, recipientPhone) => {
//     // Create a new session ID using the Whatsapp phone number
//     const sessionId = recipientPhone.split('@')[0];
//     // Create a new Dialogflow session client using the service account key
//     const sessionClient = new SessionsClient(config);
//     const session = sessionClient.sessionPath(projectId, sessionId);
//     const dialogflowResponse = await sessionClient.detectIntent({
//     session,
//     queryInput: {
//         text: {
//         text: incomingMessageContent,
//         languageCode: 'en-US',
//             },
//         },
//     });
//     const { fulfillmentText } = dialogflowResponse[0].queryResult;
//     console.log("+++dialogflowResponse++++")
//     console.log(dialogflowResponse)
//     const { action } = dialogflowResponse[0].queryResult;
//     const { parameters } = dialogflowResponse[0].queryResult

//     return {
//         "fulfillmentText": fulfillmentText,
//         "action": action,
//         "parameters": parameters
//     }
// }