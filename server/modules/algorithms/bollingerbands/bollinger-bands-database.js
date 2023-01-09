const databaseApikeyManager = require("../../../modules/database_manager/database-apikey-manager.js");

const setBBAlgoDB = async (email, client, algoData) => {
  try {
    const collection = client.db("arwis").collection("users");

    algoData = { ...algoData, algo: "BBands" };
    //adds the new algo to the database
    await collection.updateOne(
      { email },
      {
        $push: {
          algorithms: { $each: [algoData], $position: 0 },
        },
      },
      { upsert: true }
    );
  } catch (e) {
    console.log(e);
  }
};

const setBBAlgoActiveDB = async (email, client, algoId, active) => {
  try {
    const collection = client.db("arwis").collection("users");
    await collection.updateOne(
      { email },
      {
        $set: {
          "algorithms.$[algo].active": active,
        },
      },
      {
        arrayFilters: [{ "algo.id": algoId }],
      }
    );
  } catch (e) {
    console.log(e);
  }
};

const getDBAlgos = async (email, client) => {
  try {
    const collection = client.db("arwis").collection("users");
    const user = await collection.find({ email: email }).toArray();
    const algoData = user[0].algorithms;
    console.log(algoData);
    return algoData;
  } catch (e) {
    console.log(e);
  }
};

const deleteDBAlgo = async (email, client, algoId) => {
  try {
    const collection = client.db("arwis").collection("users");
    await collection.updateOne(
      { email },
      {
        $pull: {
          algorithms: { id: algoId },
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  setBBAlgoDB,
  getDBAlgos,
  deleteDBAlgo,
  setBBAlgoActiveDB,
};
