const path = require('path');
const { parentPort } = require('worker_threads')
const hash = require('object-hash');
 
require('ts-node').register();
const ProveWorkCommand = require(path.resolve(__dirname, './ProveWorkCommand.ts')).default;

parentPort.on("message", (e) => {
  const proveWorkCommand = new ProveWorkCommand();
  const solvedBlock = proveWorkCommand.execute(e);
  parentPort.postMessage(solvedBlock.nonce);
})
