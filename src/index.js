// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const {startDatabase} = require('./database/mongo');
const {insertAd, getAds,updateAd, deleteAd} = require('./database/ads');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

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

//validate access tokens.
	const jwtCheck = jwt({
  	secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-kegqt4w9.eu.auth0.com/.well-known/jwks.json'
  	}),
  // Validate the audience and the issuer.
	audience: 'https://ads-api',
	issuer: 'https://dev-kegqt4w9.eu.auth0.com/',
	algorithms: ['RS256']
	});

//secure the post, put, and delete endpoints 
app.use(jwtCheck);

app.post('/add', async(req,res) => {
	const newAd = req.body;
	await insertAd(newAd);
	res.send({message: 'new ad inserted'} )
});

app.put('/update/:id', async(req,res) => {
	const updatedAd = req.body;
	const id = req.params.id;
	await updateAd(id,updatedAd);
	res.send({message: `ad ${id} has been updated`})
});

app.delete('/delete/:id', async(req,res) => {
	const id = req.params.id;
	await deleteAd(id);
	res.send({message: `ad ${id} has been removed from database`})
});


// start the in-memory MongoDB instance
startDatabase().then( (res, err) => {
   console.log('connected to the database ')
})
.catch(err => console.log(err));

// start the server
  app.listen(3000, async () => {
    console.log('listening on port 3000');
});