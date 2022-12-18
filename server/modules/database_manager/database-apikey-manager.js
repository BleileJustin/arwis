const JSEncrypt = require("node-jsencrypt");

// ENCRYPT APIKEY AND APISECRET
const encryptKey = (key, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encryptedKey = encrypt.encrypt(key);
  return encryptedKey;
};

// DECRYPT APIKEY AND APISECRET
const decryptKey = (encryptedKey, privateKey) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(privateKey);
  const decryptedKey = decrypt.decrypt(encryptedKey);
  return decryptedKey;
};

const sendEncryptedApiKeyToDB = async (
  dbPublicKey,
  clientApiKey,
  clientApiSecret,
  email,
  client
) => {
  try {
    const userApiKey = await encryptKey(clientApiKey, dbPublicKey);
    const userApiSecret = await encryptKey(clientApiSecret, dbPublicKey);

    const collection = client.db("arwis").collection("users");

    collection.updateOne(
      { email: email },
      { $set: { apiKey: userApiKey, apiSecret: userApiSecret } },
      { upsert: true }
    );
  } catch (e) {
    console.log(e);
  }
};

const getEncryptedApiKeyFromDBAndDecrypt = async (
  email,
  privateKey,
  client
) => {
  const collection = await client.db("arwis").collection("users");
  try {
    const user = await collection.find({ email: email }).toArray();
    const encryptedApiKey = user[0].apiKey;
    const encryptedApiSecret = user[0].apiSecret;
    const apiKey = decryptKey(encryptedApiKey, privateKey);
    const apiSecret = decryptKey(encryptedApiSecret, privateKey);
    return { apiKey, apiSecret };
  } catch (e) {
    console.log(e);
  }
};

// DELETE USER FROM DATABASE
const deleteUserFromDB = async (email, client) => {
  const collection = client.db("arwis").collection("users");
  try {
    await collection.deleteOne({ email: email });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  sendEncryptedApiKeyToDB,
  getEncryptedApiKeyFromDBAndDecrypt,
  deleteUserFromDB,
  encryptKey,
  decryptKey,
};
