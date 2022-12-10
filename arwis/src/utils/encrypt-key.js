import { JSEncrypt } from "jsencrypt/bin/jsencrypt";

const encryptKey = (key, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  const encryptedKey = encrypt.encrypt(key);

  return encryptedKey;
};

export default encryptKey;
