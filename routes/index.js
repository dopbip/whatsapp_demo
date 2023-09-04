'use strict';
const router = require('express').Router();
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');
const { SessionsClient } = require('dialogflow');

const MetaConfig = {
    accessToken: 'EAACnqNygr3EBO3037yRy2DuiZCWQpZADQ53WInihCD5t1SqfBUYLydMjJZAJZBwTmK8rHZAVkB0o7ZCAT9oAJfe5lXCTU2VpD76zd8rXSZB1gJQQMJ3BcqdJEJdJ85qqHDu9GI3gRQZAxMjJDQEzeuJp6K9LIC0ZA5sZAZBDdDDTJp3nlp2HO7y9u78z9ljczT6QwCX4DRlibJINuy1IF1vQcwVjU3EWYYZD',
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
        let incomingMessage = data.message;
        let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
        let recipientName = incomingMessage.from.name;
        let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
        let message_id = incomingMessage.message_id; // extract the message id


        if (data?.isMessage) {
            console.log(`The msg recieved is : ${JSON.stringify(incomingMessage, undefined, 2)}`)
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
