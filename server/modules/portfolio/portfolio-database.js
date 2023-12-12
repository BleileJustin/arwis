// GET PORTFOLIO VALUE RECORDS FROM DATABASE

const databaseApikeyManager = require("../../modules/database_manager/database-apikey-manager.js");
const portfolio = require("../../modules/portfolio/portfolio-analytics.js");

const getPortfolioValueRecordsFromDB = async (email, client) => {
  const collection = client.db("arwis").collection("users");
  try {
    const user = await collection.find({ email: email }).toArray();
    if (!user[0].portfolioValueRecord) {
      return [];
    } else {
      return user[0].portfolioValueRecord;
    }
  } catch (e) {
    console.log(e);
  }
};

// SET PORTFOLIO VALUE IN DATABASE
const startSetPortfolioValueInDB = async (email, client, dbPrivateKey) => {
  try {
    const api = await databaseApikeyManager.getEncryptedApiKeyFromDBAndDecrypt(
      email,
      dbPrivateKey,
      client
    );
    const collection = client.db("arwis").collection("users");

    setInterval(async () => {
      const portfolioValue = await portfolio.getPortfolioValueFromBinance(
        api.apiKey,
        api.apiSecret
      );
      const portfolioValueRecord = {
        portfolioValue: portfolioValue,
        timestamp: Date.now(),
      };
      if (portfolioValueRecord.portfolioValue !== undefined) {
        console.log("SETTING PORTFOLIO VALUE IN DB");
        console.log(email);
        console.log(portfolioValueRecord);
        console.log(" ");
        await collection.updateOne(
          { email: email },
          { $push: { portfolioValueRecord: portfolioValueRecord } },
          { upsert: true }
        );
      }
    }, 1000 * 60 * 15); // 15 minutes
  } catch (e) {
    console.log(e);
  }
};

const startSetPortfolioValueInDBforEachUser = async (client, dbPrivateKey) => {
  //need to get list of users
  //access db
  const collection = client.db("arwis").collection("users");
  const findResult = await collection.find({}).toArray();
  const emailArr = [];
  findResult.forEach((result) => {
    emailArr.push(result.email);
  });
  emailArr.forEach((email) => {
    startSetPortfolioValueInDB(email, client, dbPrivateKey);
  });

  // run startSetPortfolioValueInDB for each user
};

module.exports = {
  getPortfolioValueRecordsFromDB,
  startSetPortfolioValueInDB,
  startSetPortfolioValueInDBforEachUser,
};
