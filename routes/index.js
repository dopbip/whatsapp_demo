'use strict';
const router = require('express').Router();
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');
const { dialogflowRequest } = require('../functions/operation')

const MetaConfig = {
    accessToken: 'EAACnqNygr3EBOxvMglTmR6eqsldOdcywtm5FFFVq4fjcGo0O1DZCCyPLZBnPB1iZAQnE7748R6Lu03bof82li0ZA392UPHf8NGnqSJStaUiyB0NiIshOKfsb4ylsvzr7Dzab3ZC9RrKEIWbLLGwdZBJaE1HkPfRDpU6ilDZAtGDwgQlE0XqU5Vj8fTq9a5yGgA5zgPiydTVP50UBMZAumulw0U9CjFUZD',
    senderPhoneNumberId: '118618771205644',
    WABA_ID: '118416884561172',

    graphAPIVersion: 'v17.0',

    Meta_WA_VerifyToken:'happy_panda_in_space'
};

const Whatsapp = new WhatsappCloudAPI(MetaConfig);

router.get('/', (req, res) => res.send('Hola Meta!'));

router.post('/meta_wa_callbackurl', async (req, res) => {
    try {
        // console.log('POST: Someone is pinging me!');
        let data = Whatsapp.parseMessage(req.body);
        // console.log('######################################')
        // console.log(JSON.stringify(data, undefined, 2))
        // console.log('######################################')
        
        if (data?.isMessage) {
            let incomingMessage = data.message;
            let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
            let recipientName = incomingMessage.from.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
            let message_id = incomingMessage.message_id; // extract the message id


            console.log(`The msg recieved is : ${JSON.stringify(incomingMessage, undefined, 2)}`)
            let chatText = incomingMessage.text.body

             // Send the message to Dialogflow for processing
             let dialogflowResponse = await dialogflowRequest(chatText)

             // Extract the response from Dialogflow and send it back to Whatsapp
             let fulfillmentText = dialogflowResponse.fulfillmentText
             let action = dialogflowResponse.action
             let parameters = dialogflowResponse.parameters
             console.log(JSON.stringify(dialogflowResponse, undefined, 2))

             //Actions cases 
             switch (action) {
                case 'input.unknown':
                    await Whatsapp.sendSimpleButtons({
                        message: `Hey ${recipientName},\nWellcome to *Valley lilies just4u*\nI am AI chatbot and am here to assist you! \nPlease choose from the following:`,
                        recipientPhone: recipientPhone, 
                        listOfButtons: [
                            {
                                title: '👙 Women',
                                id: 'women_category',
                            },
                            {
                                title: '🩲 Men',
                                id: 'men_category',
                            },
                            // {
                            //     title: 'Speak to a human',
                            //     id: 'speak_to_human',
                            // },
                        ],
                    });
                    break;
                case 'input.welcome':
                    await Whatsapp.sendSimpleButtons({
                        message: `Hey ${recipientName},\nWellcome to *Valley lilies just4u*\nI am AI chatbot and am here to assist you! \nPlease choose from the following:`,
                                recipientPhone: recipientPhone, 
                                listOfButtons: [
                                    {
                                        title: '👙 Women',
                                        id: 'women_category',
                                    },
                                    {
                                        title: '🩲 Men',
                                        id: 'men_category',
                                    },
                                    // {
                                    //     title: 'Speak to a human',
                                    //     id: 'speak_to_human',
                                    // },
                                ],
                            });
                    break;
                default:
                    break;
             }

             await Whatsapp.markMessageAsRead({
                message_id,
            });

        } 
        else if (data?.isMessage == false) {
            console.log(`*** is not isMessage debug ***`)
            console.log(JSON.stringify(data, undefined, 2))
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error({ error });
        return res.sendStatus(500);
    }
});

router.get('/meta_wa_callbackurl', (req, res) => {
    try {
        console.log('GET: Someone is pinging me!');

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (
            mode &&
            token &&
            mode === 'subscribe' &&
            MetaConfig.Meta_WA_VerifyToken === token
        ) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error({ error });
        return res.sendStatus(500);
    }
});
module.exports = router;
