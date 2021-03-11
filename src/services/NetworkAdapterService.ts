import getMAC from "getmac";
import publicIp from "public-ip";

export type NetworkInterface = {
  ipAddress: string;
  macAddress: string;
}

export default class NetworkAdapterService {
  getV4Address(): publicIp.CancelablePromise<string> {
    return publicIp.v4();
  }

  getV6Address(): publicIp.CancelablePromise<string> {
    return publicIp.v6();
  }

  getMacAddress(): string {
    return getMAC();
  }

  async getNetworkInterface(): Promise<NetworkInterface> {
    const ipAddress = await this.getV4Address();
    return {
      ipAddress,
      macAddress: this.getMacAddress()
    };
  }
}
