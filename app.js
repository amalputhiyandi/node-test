const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.text());

var totalReqCount = 0;
var totalSlowReqCount = 0;
var totalFastReqCount = 0;


// Hardcoded user credentials (for demonstration purposes only)

app.post('/fastUrl', (req, res) => {
    
    console.log("fastUrl----------------------------------");
    console.log(req.headers)
    console.log(req.body)
    console.log("fastUrl----------------------------------")

    let amz = req.headers['x-amz-sns-message-type'];
    if(amz != null &&  amz == 'SubscriptionConfirmation'){
        processWebhookConfirmation(req.body,req.headers);
    }


    const authHeader = req.headers.authorization;
    if (authHeader) {
        console.log("Auth header => "+authHeader)
        return res.sendStatus(200);
    } else {
        console.log("Auth header not found sending 401");
        return res.sendStatus(401);
    }
});

app.post('/authTest2', (req, res) => {
    
    console.log("authTest----------------------------------");
    console.log(req.headers)
    console.log(req.body)
    console.log("authTest----------------------------------");

    let amzMessageType = req.headers['x-amz-sns-message-type'];
    let amzWWWAuth = req.headers['www-authenticate'];

    const authHeader = req.headers.authorization;
    if (authHeader || amzWWWAuth) {
        console.log("Auth header => "+authHeader);
        console.log("amzWWWAuth => "+amzWWWAuth);

        if(amzMessageType != null &&  amzMessageType == 'SubscriptionConfirmation'){
            processWebhookConfirmation(req.body,req.headers);
            res.set('Authorization', 'Basic QU1BTDoxMjM0NQ==');
            console.log("Setting auth header")
            return res.sendStatus(200);            
        }else{
            res.set('Authorization', 'Basic QU1BTDoxMjM0NQ==');
            return res.sendStatus(200);
        }
       
    } else {
        console.log("Auth header not found sending 401");
        res.set('Authorization', 'Basic QU1BTDoxMjM0NQ==');
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

            console.log("Auth header => "+authHeader)
            return res.sendStatus(200);
        } else {
            console.log("Auth header not found sending 401");
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
    console.log("processWebhookConfirmation")
   let jsonObj = body ;
    if(typeof(jsonObj) == 'string'){
        jsonObj = parseJSONString(body);
    }

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
    console.log(`Test3 Server is running on http://localhost:${PORT}`);
    console.log(new Date());
});