// ./src/database/mongo.js
const MongoClient = require('mongodb').MongoClient;
let database = null;

async function startDatabase() {
  
 const uri = "mongodb+srv://dbBoschiero:forMyiVoteApp2020@cluster-bosc-8in8d.mongodb.net/test?retryWrites=true&w=majority";
 const client = new MongoClient(uri, { useNewUrlParser: true ,  useUnifiedTopology: true});
 const connection = await client.connect();

  database = connection.db();
  
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};




