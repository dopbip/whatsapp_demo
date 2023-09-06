'use strict';
const router = require('express').Router();
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');
const { dialogflowRequest } = require('../functions/operation')

const MetaConfig = {
    accessToken: 'EAACnqNygr3EBO0ZAbR8Bmit04uHCeMLQEJnY8TD99QtfXs6kDJRp0yHxjyZAId6sQpXsqV0XuAlOKaXDWH6hF1DOTGLKM3oQeiiZCYyUtV6ND5GB7jQ3QHfRC2kWQ73pjT6YTNx7SRjc0Er6YRxa5mapU6zFlhdmWsazZBucyMhCVkyPFaer6QPzFt6Re2t2osLpsWZBTZCos6IK2VuSeK9hvlkNkZD',
    senderPhoneNumberId: '118618771205644',
    WABA_ID: '118416884561172',
    graphAPIVersion: 'v17.0.',
    Meta_WA_VerifyToken:'happy_panda_in_space'
};

const Whatsapp = new WhatsappCloudAPI(MetaConfig);

router.get('/', (req, res) => res.send('Hola Meta!'));

router.post('/meta_wa_callbackurl', async (req, res) => {
    try {
        // console.log('POST: Someone is pinging me!');
        let data = Whatsapp.parseMessage(req.body);
        console.log(JSON.stringify(data, undefined, 2))
        let incomingMessage = data.message;
        let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
        let recipientName = incomingMessage.from.name;
        let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
        let message_id = incomingMessage.message_id; // extract the message id


        if (data?.isMessage) {
            console.log(`The msg recieved is : ${JSON.stringify(incomingMessage, undefined, 2)}`)
            let chatTextt = incomingMessage.text.body

             // Send the message to Dialogflow for processing
             let dialogflowResponse = await dialogflowRequest(chatTextt, recipientPhone)

             // Extract the response from Dialogflow and send it back to Whatsapp
             let fulfillmentText = dialogflowResponse.fulfillmentText
             let action = dialogflowResponse.action
             let parameters = dialogflowResponse.parameters
             console.log(JSON.stringify(dialogflowResponse, undefined, 2))

             //Actions cases 
             switch (action) {
                case 'input.unknown':
                    
                    break;
                case 'input.welcome':
                    await Whatsapp.sendSimpleButtons({
                                message: `Hey ${recipientName}, am AI chatbot and am here to assist you! \nPlease choose from the following:`,
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

        } else if (!data?.isMessage) {
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
