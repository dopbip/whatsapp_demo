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

            if (typeOfMsg === 'text_message') {
            let msg = incomingMessage.text.body;

            // Send the message to Dialogflow for processing
            let dialogflowResponse = await dialogflowRequest(msg)

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
                            {
                                title: '🧸 Adult toys',
                                id: 'adult_toys',
                            },
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
                                    {
                                        title: '🧸 Adult toys',
                                        id: 'adult_toys',
                                    },
                                ],
                            });
                    break;
                default:
                    break;
            }

            }

            if (typeOfMsg === 'simple_button_message') {
                let button_id = incomingMessage.button_reply.id;
                switch (button_id) {
                    case 'women_category':
                        await Whatsapp.sendSimpleButtons({
                            message: `Please choose from the following:`,
                            recipientPhone: recipientPhone, 
                            listOfButtons: [
                                {
                                    title: '🛍️ Bra',
                                    id: 'bra_items',
                                },
                                {
                                    title: '🛍️ Panty',
                                    id: 'panty_items',
                                },
                            ],
                        });
                        break;
                    case 'bra_items':
                        listOfItems = await Store.getItemsInCategory("bra_items");
                        console.log(listOfItems)
                        listOfItems.data.map( async(items) =>  {
                            let availableSizesAndColors = ''
                            let availableSizes = ''
                            let imageUrl = items.imageUrl
                            let serial_number = items.serial_number
                            let colors = items.color
                            let sizeData = items.size
    
                            colors.forEach(color => {
                                // availableColors += ` - ${color}`
                                let colorName = color
    
                                if (sizeData.hasOwnProperty(colorName)) {
                                    const sizes = sizeData[colorName];
                                    console.log(`Sizes for ${colorName}: ${sizes.join(", ")}`);
                                    availableSizesAndColors += `Sizes for *${colorName}: ${sizes.join(", ")}*\n`
                                  } else {
                                    console.log(`Sizes for ${colorName} not found.`);
                                  }
                            });
                            
    
                            //let text = `*${serial_number}* \nColor:${availableColors}\nSize:${availableSizes}\n\n👉🏽 *Reply with* ${serial_number} color size_ *to order this item*`
                            let text = `*${serial_number}* \n${availableSizesAndColors}` //\n👉🏽 _*Reply with* ${serial_number} color size *to order this item*_
                            
                            Whatsapp.sendImage({
                                recipientPhone: recipientPhone,
                                url: imageUrl,
                                caption: text,
                            });
                            // function function1(recipientPhone, imageUrl, text) {
                            //     return new Promise((resolve, reject) => {
                            //         // Your code for function1 here
                            //         Whatsapp.sendImage({
                            //             recipientPhone: recipientPhone,
                            //             url: imageUrl,
                            //             caption: text,
                            //         });
                            //         console.log("Function 1 executed");
                            //         resolve();
                            //     });
                            // }
                            
                            // function  function2(serial_number, recipientPhone) {
                            //     // Your code for function2 here
                            //     Whatsapp.sendSimpleButtons({
                            //         message: `🔖 ${serial_number}`,
                            //         recipientPhone: recipientPhone, 
                            //         listOfButtons: [
                            //             {
                            //                 title: 'Select',
                            //                 id: `braItemsId_${serial_number}`,
                            //             }                                
                            //         ],
                            //     });
                            //     console.log("Function 2 executed");
                            // }
                            
                            // function1(recipientPhone, imageUrl, text)
                            //     .then(() => function2(serial_number, recipientPhone))
                            //     .catch(err => {
                            //         console.error(err);
                            //     });
                        })
                        break
                    default:
                        break;
                }
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
