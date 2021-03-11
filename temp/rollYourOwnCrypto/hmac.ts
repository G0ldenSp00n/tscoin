import {sha512} from 'js-sha512';

export default class EllipticCurveService {
  constructor() {
  }

  private buffXor(buffA: Buffer, buffB: Buffer) {
    const maxLength = Math.max(buffA.length, buffB.length);
    const resBuffer = Buffer.allocUnsafe(maxLength);

    for(let i = 0; i < maxLength; i++) {
      resBuffer[i] = buffA[i] ^ buffB[i];
      if (buffA[i] !== 0) {
        console.log('buffA', buffA[i])
        console.log('buffB', buffB[i])
        console.log('buffRes', resBuffer[i])
      }
    }
    return resBuffer;
  }

  private buffOr(buffA: Buffer, buffB: Buffer) {
    const maxLength = Math.max(buffA.length, buffB.length);
    const resBuffer = Buffer.allocUnsafe(maxLength);

    for(let i = 0; i < maxLength; i++) {
      resBuffer[i] = buffA[i] | buffB[i];
    }
    return resBuffer;
  }
  hmacSha512(key: Buffer, message: Buffer) {
    const blockSize = 64;
    if (key.length > blockSize) {
      key = Buffer.from(sha512(key.toString()));
    }

    if (key.length < blockSize) {
      const extendedBuff = Buffer.allocUnsafe(blockSize);
      for (let i = 0; i < blockSize; i++) {
        if (i < key.length) {
          extendedBuff[i] = key[i];
        } else {
          extendedBuff[i] = 0x00;
        }
      } 
      key = extendedBuff;
    }

    const outerPadding = Buffer.alloc(blockSize);
    const innerPadding = Buffer.alloc(blockSize);
    for(let i = 0; i < blockSize; i++) {
      outerPadding[i] = 0x5c;
      innerPadding[i] = 0x36;
    }
    const outerPaddedKey = this.buffXor(key, outerPadding);
    const innerPaddedKey = this.buffXor(key, innerPadding);
    console.log(key);
    console.log(outerPaddedKey);
    console.log(innerPaddedKey);
    return sha512(Buffer.concat([outerPaddedKey, Buffer.from(sha512(Buffer.concat([innerPaddedKey, message]).toString()))]).toString())
  }
}

cons ec = new EllipticCurveService();
console.log(ec.hmacSha512(Buffer.from("key"), Buffer.from("test")));
