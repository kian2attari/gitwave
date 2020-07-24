const {MongoClient} = require('mongodb');
const assert = require('assert');

// Connection URL
const url = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(url, {useUnifiedTopology: true});

// Database Name
const dbName = process.env.MONGODB_NAME;
/**
 *
 *
 * @param {String} internal_triage_channel_id
 */
function add_one_to_DB(internal_triage_channel_id) {
  // Use connect method to connect to the Server
  client.connect(err => {
    assert.equal(null, err);
    console.log('Connected correctly to server');

    const db_obj = client.db(dbName);

    console.log('db_obj', db_obj);
    //   // Insert multiple documents
    //   db_obj.collection('inserts').insertMany([{a: 2}, {a: 3}], function (err, r) {
    //     assert.equal(null, err);
    //     assert.equal(2, r.insertedCount);

    //     client.close();
    //   });

    const new_obj = {internal_triage_channel_id, internal_triage_items: []};

    // Insert a single document
    db_obj.collection('gitwave_team_data').insertOne(new_obj, (error, response) => {
      assert.equal(null, error);
      assert.equal(1, response.insertedCount);
    });
  });
}

exports.add_one_to_DB = add_one_to_DB;
