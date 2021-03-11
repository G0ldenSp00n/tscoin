import hash from 'object-hash';
import {Block} from "../entities/Block";
import {performance} from 'perf_hooks';

const DIFFICULTY = 4;
export default class ProveWorkCommand {
  constructor() {
  }

  async prepare(): Promise<void> {
  }

  static run({
    block
  }: {
    block: Block
  }) {
    let foundNonce = false;
    let nonce = 0;
    while(!foundNonce) {
      const objHash = hash(block);
      const hashCheck = objHash.slice(-DIFFICULTY);
      if (hashCheck === new Array(DIFFICULTY + 1).join("0")) {
        foundNonce = true;
        break;
      }
      nonce += 1;
      block.nonce = ""+nonce;
    }

    return block;
  }

  async persist(): Promise<void> {
  }

  execute(block: Block): Block {
    //await this.prepare();
    return ProveWorkCommand.run({ block });
    //await this.persist();
  }
}
