import {Node} from "../entities/Node";
import hash from 'object-hash';
import NetworkAdapterService, {NetworkInterface} from "../services/NetworkAdapterService";

export default class InitializeNodeCommand {
  private networkAdapterService: NetworkAdapterService;
  constructor({networkAdapterService}: {networkAdapterService: NetworkAdapterService}) {
    this.networkAdapterService = networkAdapterService
  }

  async prepare(): Promise<NetworkInterface> {
    const networkInterface = this.networkAdapterService.getNetworkInterface();
    return networkInterface;
  }

  static run({ networkInterface }: { networkInterface: NetworkInterface }): Node {
    return {
      ip: networkInterface.ipAddress,
      mac: networkInterface.macAddress,
      nodeID: hash(networkInterface.ipAddress)
    }
  }

  async persist(): Promise<void> {
  }

  async execute() {
    const networkInterface = await this.prepare();
    const node = InitializeNodeCommand.run({ networkInterface });
    console.log(node);
    await this.persist();
  }
}
