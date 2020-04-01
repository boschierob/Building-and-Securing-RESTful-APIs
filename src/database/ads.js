// ./src/database/ads.js
const {getDatabase, } = require('./mongo');

const {ObjectID} = require('mongodb');

const collectionName = 'ads';

async function insertAd(ad) {
	const database = await getDatabase();
	return( await database.collection('ads').insertOne(ad)
		);
	closeDatabase();
}

async function updateAd(id, ad) {
	const database = await getDatabase();
	delete ad._id;
   await database.collection('ads').update(
  { _id: new ObjectID(id),},
  {
  	$set: {
  		...ad,
  	},
  },

  );
}

async function deleteAd(id) {
  const database = await getDatabase();
  await database.collection(collectionName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function getAds() {
  const database = await getDatabase();
  return (await database.collection('ads').find({}).toArray());
  closeDatabase();
}


module.exports = {
  insertAd,
  getAds,
  updateAd,
  deleteAd
};