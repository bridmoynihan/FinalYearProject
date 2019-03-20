import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
// app.use(myMiddleware);

exports.widgets = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        response.set('Access-Control-Allow-Origin', '*').sendStatus(200);
        // response.status(200).send({widgets: 'Testing functions'});
        if (request.method === 'OPTIONS') {
            // Send response to OPTIONS requests
            response.set('Access-Control-Allow-Methods', 'GET');
            response.set('Access-Control-Allow-Headers', 'Content-Type');
            response.set('Access-Control-Max-Age', '3600');
            response.status(204).send('');
          } else {
            // Set CORS headers for the main request
            response.set('Access-Control-Allow-Origin', '*');
            response.send('Hello World!');
          }
         response.end() 
        
    })
 })
