const openpgp = require('openpgp');

(async () => {
    const { privateKey, publicKey } = await openpgp.generateKey({
        type: 'rsa',
        rsaBits: 2048,
        userIDs: [{ name: 'IndoPay Test', email: 'test@indopay.com' }],
        format: 'armored'
    });
    console.log('export const TEST_PRIVATE_KEY = `' + privateKey + '`;');
    console.log('export const TEST_PUBLIC_KEY = `' + publicKey + '`;');
})();
