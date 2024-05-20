const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Hardcoded user credentials (for demonstration purposes only)

app.post('/fastUrl', (req, res) => {
    
    let amz = req.headers['x-amz-sns-message-type'];
    if(amz != null &&  amz == 'SubscriptionConfirmation'){
        processWebhookConfirmation(req.body);
    }
    console.log("fastUrl----------------------------------");
    console.log(req.headers)
    console.log(req.body)
    console.log("fastUrl----------------------------------")

    const authHeader = req.headers.authorization;
    if (authHeader) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(401);
    }
});

app.post('/slowUrl', (req, res) => {
    
    console.log("slowUrl ----------------------------------");
    console.log(req.headers)
    console.log(req.body)
    console.log("slowUrl----------------------------------")

    let amz = req.headers['x-amz-sns-message-type'];
    if(amz != null &&  amz == 'SubscriptionConfirmation'){
        processWebhookConfirmation(req.body);
    }

    
    const authHeader = req.headers.authorization;
    setTimeout(() => {
        if (authHeader) {
            return res.sendStatus(200);
        } else {
            return res.sendStatus(401);
        }
    }, 30000);
});

app.post('/slowUrl100', (req, res) => {
    
    console.log("slowUrl ----------------------------------");
    console.log(req.headers)
    console.log(req.body)
    console.log("slowUrl----------------------------------")

    let amz = req.headers['x-amz-sns-message-type'];
    if(amz != null &&  amz == 'SubscriptionConfirmation'){
        processWebhookConfirmation(req.body);
    }


    const authHeader = req.headers.authorization;
    setTimeout(() => {
        if (authHeader) {
            return res.sendStatus(200);
        } else {
            return res.sendStatus(401);
        }
    }, 100000);
});

function processWebhookConfirmation(body){

    console.log(body.SubscribeURL)

    https.get(body.SubscribeURL, (response) => {
        let data = '';

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        response.on('end', () => {
            console.log("Response from SNS post subscription")
            console.log(data);
        });

    }).on('error', (err) => {
        console.error('Error making GET request:', err);
    });
}


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});