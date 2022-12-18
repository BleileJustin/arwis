// SET INSTANCE OF WALLET IN DATABASE
// ////////////////////////////////////////////////////
const setWalletInDB = async (email, wallet, client) => {
  const collection = client.db("arwis").collection("users");
  try {
    const result = await collection.updateOne(
      { email: email },
      { $push: { wallets: wallet } },
      { upsert: true }
    );
  } catch (e) {
    console.log(e);
  }
};

const deleteWalletFromDB = async (email, curPair, client) => {
  const collection = client.db("arwis").collection("users");
  try {
    await collection.updateOne(
      { email: email },
      { $pull: { wallets: { curPair: curPair } } },
      { upsert: true }
    );
  } catch (e) {
    console.log(e);
  }
  res.status(200).send();
};

// GET WALLET FROM DATABASE
const getWalletsFromDB = async (email, client) => {
  const collection = client.db("arwis").collection("users");
  try {
    const user = await collection.find({ email: email }).toArray();
    if (!user[0].wallets) {
      return [];
    } else {
      return user[0].wallets;
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  setWalletInDB,
  getWalletsFromDB,
  deleteWalletFromDB,
};
