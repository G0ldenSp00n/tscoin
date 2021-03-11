import { MerkleTree } from './MerkleTree'

export type Block = {
  prev_hash: string;
  nonce: string;
  root_hash: string;
  txTree: MerkleTree
}
