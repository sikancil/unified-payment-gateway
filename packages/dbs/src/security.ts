import * as openpgp from 'openpgp';

export async function encryptPayload(data: object, publicKeyArmored: string): Promise<string> {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const message = await openpgp.createMessage({ text: JSON.stringify(data) });

  const encrypted = await openpgp.encrypt({
    message,
    encryptionKeys: publicKey,
  });

  return encrypted as string;
}

export async function decryptPayload(encryptedData: string, privateKeyArmored: string): Promise<object> {
  const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
  const message = await openpgp.readMessage({ armoredMessage: encryptedData });

  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return JSON.parse(decrypted as string);
}
