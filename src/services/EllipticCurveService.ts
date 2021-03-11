import fs from 'fs';
import readline from 'readline'
import path from 'path'
import jsSha from 'jssha'

export default class EllipticCurveService {
  constructor() {
    const readInterface = readline.createInterface(fs.createReadStream(path.resolve(__dirname, "./EllipticalCurveServiceData/wordlists/english.txt")))
    let i = 0;
  }

  generateMasterKey(mneumonicCode: string[], passphrase: string) {
    const mneumonicString = mneumonicCode.join(" ");
    console.log("-" + mneumonicString + "-")
    const seed = this.pbkdf2("venue crop come", "mnemonic", 2048, 64);
  }

  private buffXor(buffA: Buffer, buffB: Buffer) {
    const maxLength = Math.max(buffA.length, buffB.length);
    const resBuffer = Buffer.alloc(maxLength);

    for(let i = 0; i < maxLength; i++) {
      resBuffer[i] = buffA[i] ^ buffB[i];
    }
    return resBuffer;
  }

  pbkdf2(password: string, salt: string, iterations: number, keyLength: number) {
    password = password.normalize();
    const saltBuff = Buffer.from(salt.normalize("NFKD"));
    const uBlockOne = Buffer.alloc(saltBuff.length + 4);
    saltBuff.copy(uBlockOne, 0, 0);
    uBlockOne.writeInt32BE(1);
    const firstBlock = new jsSha("SHA-512", "TEXT", {
      hmacKey: { value: saltBuff.toString("hex"), format: "HEX" },
    });
    firstBlock.update(password);
    const blockOne = Buffer.from(firstBlock.getHMAC("ARRAYBUFFER"));
    const Ui: Buffer[] = [
      blockOne.slice(0, 64)
    ];
    let output = Buffer.alloc(64);
    for (let i = 1; i < iterations; i++) {
      const blockI = new jsSha("SHA-512", "TEXT", {
        hmacKey: { value: saltBuff.toString("hex"), format: "HEX" },
      });
      blockI.update(password)
      Ui.push(Buffer.from(blockI.getHMAC("ARRAYBUFFER")).slice(0, 64))
      for(let k = 0; k < 64; k++) {
        output[k] = Ui[i-1][k] ^ Ui[i][k];
      }
    }
    console.log(output.toString('hex'));
  }
}
