// GET PORTFOLIO VALUE RECORDS FROM DATABASE
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
const setPortfolioValueInDB = async (email, client) => {
  try {
    const api = await getEncryptedApiKeyFromDBAndDecrypt(email, dbPrivateKey);
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
    }, 1000 * 60 * 5); // 5 MINUTES
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getPortfolioValueRecordsFromDB,
  setPortfolioValueInDB,
};
