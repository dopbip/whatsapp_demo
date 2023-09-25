const { createBot } = require('whatsapp-cloud-api');
const { dialogflowRequest } = require('../functions/operation')

(async () => {
  try {
    // replace the values below from the values you copied above
    const from = '118618771205644';
    const token = 'EAACnqNygr3EBO4LsAkbVuBTFC7blUfHVpUzhXoWfagXHU79UgWJqJpAyrbAhKGOF7eZByvMAk2eo7A2u0ZCgR88rAFBZCUeIHle9PEH7bN0tVwZCxlou5LyOtlRFtWxGhhcQyXjTJreG2VjfitthEouFLZAvIZAdf4FzZBDnUBHVTG12Atpt0FMyvZBEL3bLTfuNqVXkd4HZCJuqZC4kYJccZA9v8ApkUnC';
    //const to = '260978681630'; // your phone number without the leading '+'
    const webhookVerifyToken = 'happy_panda_in_space'; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

    const bot = createBot(from, token);

    //const result = await bot.sendText(to, 'Hello world');

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken,
      port: process.env.PORT || 3001,
      webhookPath: `/meta_wa_callbackurl`,
    });

    // Listen to ALL incoming messages
    bot.on('message', async (msg) => {
      console.log(msg);

      if (msg.type === 'text') {
        let from = msg.from
        let userText = msg.data.text

        // Send the message to Dialogflow for processing
        let dialogflowResponse = await dialogflowRequest(msg)

        // Extract the response from Dialogflow and send it back to Whatsapp
        let fulfillmentText = dialogflowResponse.fulfillmentText
        let action = dialogflowResponse.action
        let parameters = dialogflowResponse.parameters
        console.log(JSON.stringify(dialogflowResponse, undefined, 2))

        await bot.sendText(msg.from, 'Received your text CC!');
      } else if (msg.type === 'image') {
        await bot.sendText(msg.from, 'Received your image!');
      }
    });
  } catch (err) {
    console.log(err);
  }
})();


// const port = process.env.PORT || 3001;
// const express = require('express');

// let indexRoutes = require('./routes/index.js');

// const main = async () => {
//     const app = express();
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: false }));
//     app.use('/', indexRoutes);
//     app.use('*', (req, res) => res.status(404).send('404 Not Found'));
//     app.listen(port, () =>
//         console.log(`App now running and listening on port ${port}`)
//     );
// };
// main();
