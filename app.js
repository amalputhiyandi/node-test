const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Hardcoded user credentials (for demonstration purposes only)
const USERNAME = 'user';
const PASSWORD = 'password';


app.post('/fastUrl', (req, res) => {
    
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

    const authHeader = req.headers.authorization;
    setTimeout(() => {
        if (authHeader) {
            return res.sendStatus(200);
        } else {
            return res.sendStatus(401);
        }
    }, 100000);
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});