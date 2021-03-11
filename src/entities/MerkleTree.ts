import {Transaction} from "./Transaction";
import hash from 'object-hash';

type TxNode = {
  transaction: Transaction;
  //parent: HashNode|null;
}

type HashNode = {
  hash: string;
  //parent: HashNode|null;
  children: [HashNode, HashNode] | TxNode;
}

type TxHashNode = {
  hash: string;
  //parent: HashNode|null;
  children: TxNode;
}

export class MerkleTree {
  public rootNode: HashNode;
  constructor(transactions: Transaction[]) {
    if (transactions.length === 1) {
      this.rootNode = this.createTxHashNode(transactions[0]);
    } else {
      if (transactions.length % 2 !== 0) {
        transactions.push(transactions[transactions.length]);
      }

      const half = Math.ceil(transactions.length / 2);
      const rightTree = new MerkleTree(transactions.splice(0, half));
      const leftTree = new MerkleTree(transactions.splice(-half));

      this.rootNode = this.createHashNode([rightTree.rootNode, leftTree.rootNode]);
      //rightTree.rootNode.parent = this.rootNode;
      //leftTree.rootNode.parent = this.rootNode;
    }
  }

  private createTxHashNode(transaction: Transaction): TxHashNode {
    const baseTxNode: TxNode = {
      transaction
      //parent: null
    }

    const txHashNode = {
      hash: hash(baseTxNode),
      //parent: null,
      children: baseTxNode
    }
    
    return txHashNode;
  }

  private createHashNode(children: [HashNode, HashNode]): HashNode {
    const newHashNode = {
      hash: hash(children),
      //parent: null,
      children
    }

    return newHashNode;
  }
}
