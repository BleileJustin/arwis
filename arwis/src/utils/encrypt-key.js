import JSEncrypt from "jsencrypt/bin/jsencrypt";
const encryptedKey = (key, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encryptedKey = encrypt.encrypt(key);
  console.log(encryptedKey);
  return encryptedKey;
};

export default encryptedKey;
