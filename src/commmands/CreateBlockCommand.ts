import hash from 'object-hash';
import {Block} from "../entities/Block";
import {MerkleTree} from "../entities/MerkleTree";
import {MINER_TX_AMOUNT, Transaction, UnsignedTransaction} from "../entities/Transaction";
import RSAService from "../services/RSAService";

export default class CreateBlockCommand {
  private rsaService: RSAService;
  constructor(rsaService: RSAService) {
    this.rsaService = rsaService;
  }

  async prepare(): Promise<void> {
  }

  static run({
    minerAddress,
    verifiedTxList,
    previousBlock,
  }: {
    minerAddress: string;
    verifiedTxList: Transaction[];
    previousBlock: Block;
  }, {
    rsaService
  }: {
    rsaService: RSAService
  }) {
    const unsignedMinerTx: UnsignedTransaction = {
      txData: [{
        newOwnerPubKey: minerAddress,
        amount: MINER_TX_AMOUNT,
        previousTxHash: null
      }],
      previousTx: null
    }

    const minerTx: Transaction = {
      ...unsignedMinerTx,
      prevOwnerSig: rsaService.sign(Buffer.from(JSON.stringify(unsignedMinerTx.previousTx)), 'utf8')
    }

    const merkleTree = new MerkleTree([minerTx, ...verifiedTxList]);

    return JSON.parse(JSON.stringify({
      prev_hash: hash(previousBlock),
      nonce: '0',
      root_hash: merkleTree.rootNode.hash,
      txTree: merkleTree
    }));
  }

  async persist(): Promise<void> {
  }

  execute({
    minerAddress,
    verifiedTxList,
    previousBlock
  }: {
    minerAddress: string;
    verifiedTxList: Transaction[];
    previousBlock: Block;
  }): Block {
    //await this.prepare();
    return CreateBlockCommand.run({
      minerAddress,
      verifiedTxList,
      previousBlock
    }, {
      rsaService: this.rsaService
    });
    //await this.persist();
  }
}
