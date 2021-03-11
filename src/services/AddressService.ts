import forge from 'node-forge'

class AddressService {
  private BLOCK_SIZE = 128;
  generateBIP32Address(mnemonicString: string, passphrase: string = '') {
    const bip39Seed = this.generateBIP39Seed(mnemonicString, passphrase);
    const masterKey = this.generateHMAC(Buffer.from('Bitcoin seed', 'utf8'), Buffer.from(bip39Seed, 'hex'));
    const masterPrivKey = Buffer.alloc(32);
    const masterPubKey = Buffer.alloc(32);
    masterKey.copy(masterPrivKey, 0, 0, 32);
    masterKey.copy(masterPubKey, 0, 32, 64);
    console.log("pub", masterPubKey.toString('hex'))
    console.log("priv", masterPrivKey.readInt32BE())
  }

  generateBIP39Seed(mnemonicString: string, passphrase: string = ''): string {
    return this.generatePBKDF2(mnemonicString, 'mnemonic'+passphrase, 2048, 64);
  }

  generatePBKDF2(password: string, salt: string, iterations: number, dkLen: number): string {
    let passwordBuff = Buffer.from(password.normalize(), 'utf8');
    let saltBuff = Buffer.from(salt.normalize(), 'utf8');

    const blockCount = Math.ceil(dkLen / this.BLOCK_SIZE)
    const DKBuff = Buffer.allocUnsafe(dkLen);
    const u1Salt = Buffer.allocUnsafe(saltBuff.length + 4);
    saltBuff.copy(u1Salt, 0, 0, saltBuff.length);

    for (let Ti = 1; Ti <= blockCount; Ti++) {
      u1Salt.writeUInt32BE(Ti, saltBuff.length);

      let UPrevious: Buffer = this.generateHMAC(passwordBuff, u1Salt);
      UPrevious.copy(DKBuff, (Ti-1) * dkLen, 0, UPrevious.length);
      for(let Ui = 1; Ui < iterations; Ui++) {
        const UCurrent: Buffer = this.generateHMAC(passwordBuff, UPrevious);
        for (let byteIndex = 0; byteIndex < this.BLOCK_SIZE; byteIndex++) {
          DKBuff[((Ti-1) * dkLen)+byteIndex] ^= UCurrent[byteIndex];
          UPrevious[byteIndex] = UCurrent[byteIndex];
        }
      }
    }

    return DKBuff.toString('hex');
  }

  generateHMAC(key: Buffer, message: Buffer) {
    const keySha = forge.md.sha512.create();
    if (key.length > this.BLOCK_SIZE) {
      keySha.update(key.toString('binary'), 'raw');
      key = Buffer.from(keySha.digest().getBytes(), 'binary');
    }

    if (key.length < this.BLOCK_SIZE) {
      const paddedBuffer = Buffer.alloc(this.BLOCK_SIZE, 0);
      key.copy(paddedBuffer, 0, 0);
      key = paddedBuffer;
    }

    const o_key_pad = Buffer.alloc(this.BLOCK_SIZE);
    const i_key_pad = Buffer.alloc(this.BLOCK_SIZE);

    for(let byteIndex = 0; byteIndex < this.BLOCK_SIZE; byteIndex++) {
      o_key_pad[byteIndex] = key[byteIndex] ^ 0x5c;
      i_key_pad[byteIndex] = key[byteIndex] ^ 0x36;
    }

    const innerSha = forge.md.sha512.create();
    const outerSha = forge.md.sha512.create();
    const innerHash = Buffer.from(innerSha.update(Buffer.concat([i_key_pad, message]).toString('binary'), 'raw').digest().getBytes(), 'binary');
    const hmac = outerSha.update(Buffer.concat([o_key_pad, innerHash]).toString('binary'), 'raw').digest();

    return Buffer.from(hmac.getBytes(), 'binary');
  }
}

const as = new AddressService();
const generatedSeed = as.generateBIP32Address('venue crop come');
console.log(generatedSeed);
