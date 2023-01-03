const databaseApikeyManager = require("../../../modules/database_manager/database-apikey-manager.js");

const setBBAlgoDB = async (email, client, algoData) => {
  try {
    const collection = client.db("arwis").collection("users");
    const curPair = algoData.curPair;
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
    console.log("algoData", algoData);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  setBBAlgoDB,
};
