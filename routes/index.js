'use strict';
const router = require('express').Router();
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');

const MetaConfig = {
    accessToken: 'EAACnqNygr3EBO7yeDVWMKtfdi6HoUJUtaZAPNOrn8MFSeSm9hsHQWHEZC1iaQNIycBQhRirS7EnZBJvGuPrHTsxRsVyUF0pDGmEg77xGkZCyXgwZAS58WQTcZCsB9OopVdHJEZBBFSi3ZBl33ZCR2KBdtsxKrO50Mjl45mG7J05VWIttLkjvt398nZA5X4CXVZB2qVTI3R1ZCcMhp8gdEa7IiQfNwvfK8RwZD',
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
            console.log(`The msg recieved is : ${incomingMessage}`)
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
