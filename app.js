const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.text());

// Hardcoded user credentials (for demonstration purposes only)

app.post('/fastUrl', (req, res) => {
    
    let amz = req.headers['x-amz-sns-message-type'];
    if(amz != null &&  amz == 'SubscriptionConfirmation'){
        processWebhookConfirmation(req.body,req.headers);
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
        processWebhookConfirmation(req.body,req.headers);
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


app.get('/healthCheck', (req, res) => {
    const uptimeSeconds = process.uptime();
    const uptime = {
        seconds: uptimeSeconds,
        minutes: Math.floor(uptimeSeconds / 60),
        hours: Math.floor(uptimeSeconds / 3600),
        days: Math.floor(uptimeSeconds / 86400)
    };
    res.json({ uptime });
});


app.post('/slowUrl100', (req, res) => {
    
    console.log("slowUrl ----------------------------------");
    console.log(req.headers)
    console.log(req.body)
    console.log("slowUrl----------------------------------")

    let amz = req.headers['x-amz-sns-message-type'];
    if(amz != null &&  amz == 'SubscriptionConfirmation'){
        processWebhookConfirmation(req.body,req.headers);
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

function processWebhookConfirmation(body,headers){

   let jsonObj = parseJSONString(body);

    https.get(jsonObj.SubscribeURL, (response) => {
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

function parseJSONString(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Invalid JSON string:', error);
        return null;
    }
}


// Start the server
app.listen(PORT, () => {
    console.log(`Test Server is running on http://localhost:${PORT}`);
    console.log(new Date());
});