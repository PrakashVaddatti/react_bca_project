const crypto=require('crypto');
const { decrypt } = require('dotenv');
const algorithm='aes-256-cbc';
const secret='thisismycodenodejscrypto';
const salt ='my_salt_string';
const key=crypto.pbkdf2Sync(secret,salt,1000,32,'sha256');  //32-bytes key

function encrypt(text){
    const iv=crypto.randomBytes(16);
    const cipher=crypto.createCipheriv(algorithm,key,iv);
    let encrypted=cipher.update(text.toString(),'utf8','hex');
    encrypted+=cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;

    function decrypt(data){
        const [ivHex,encryptedText]=data.split(':');
        const iv=Buffer.from(ivHex,'hex');
        const decipher=crypto.createDecipheriv(algorithm,key,iv);
        let decrypted=decipher.update(encryptedText,'hex','utf8');
        decrypted+=decipher.final('utf8');
        return decrypted
    }
}

module.exports={encrypt,decrypt};