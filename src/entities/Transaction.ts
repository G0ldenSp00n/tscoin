export type Transaction = {
  txData: {
    newOwnerPubKey: string;
    amount: number;
    previousTxHash: string|null;
  }[]
  previousTx: Transaction|null;
  prevOwnerSig: string;
}

export type UnsignedTransaction = {
  txData: {
    newOwnerPubKey: string;
    amount: number;
    previousTxHash: string|null;
  }[]
  previousTx: Transaction;
}

export const MINER_TX_AMOUNT = 10
