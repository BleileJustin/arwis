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
const setPortfolioValueInDB = async (email, client, dbPrivateKey) => {
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
      console.log("SETTING PORTFOLIO VALUE IN DB");
      await collection.updateOne(
        { email: email },
        { $push: { portfolioValueRecord: portfolioValueRecord } },
        { upsert: true }
      );
    }, 1000 * 60 * 60); // 1 hour
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getPortfolioValueRecordsFromDB,
  setPortfolioValueInDB,
};
