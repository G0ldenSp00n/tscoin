import hash from 'object-hash';
import RSAService from "../services/RSAService";
import CreateBlockCommand from "./CreateBlockCommand";
import { Worker, MessageChannel } from 'worker_threads';

const rsaService = new RSAService();
const createBlockCommand = new CreateBlockCommand(rsaService);

const block = createBlockCommand.execute({
  minerAddress: "abc",
  verifiedTxList: [],
  previousBlock: null
});

const miningWorker = new Worker("./WorkerProveWorkCommand.js", {});
miningWorker.postMessage(block)
miningWorker.on("message", (e) => {
  block.nonce = e;
});
