// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const {startDatabase} = require('./database/mongo');
const {insertAd, getAds} = require('./database/ads');

//define Express app 
const app = express();

//array as database
const ads = [
	{title: "Coucou ,c'est encore moi !"}
];

//adding helmet to enhance API's security
app.use(helmet());

//bodyparser to parse json to javascript object
app.use(bodyParser.json());

//enabling CORS
app.use(cors());

//add morgan to log http request
app.use(morgan('combined'));

//defining endpoints to return all ads:
//endpoint that listens to HTTP GET requests and that,
// when triggered, returns all the content of the ads array.
// replace the endpoint responsible for the GET requests
app.get('/', async (req, res) => {
  res.send(await getAds());
});

// start the in-memory MongoDB instance
startDatabase().then(async () => {
  await insertAd({title: 'Hello, now from the in-memory database!'});

  
  });
// start the server
  app.listen(3000, async () => {
    console.log('listening on port 3000');
});