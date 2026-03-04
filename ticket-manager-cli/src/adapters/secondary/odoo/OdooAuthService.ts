import { OdooJsonRpcClient } from "./OdooJsonRpcClient.js";
export class OdooAuthService {
  constructor(
    private readonly rpc: OdooJsonRpcClient,
    private readonly db: string,
    private readonly email: string,
    private readonly apiKey: string,
  ) {}

  async login(): Promise<number> {
    const uid = await this.rpc.call("common", "login", [
      this.db,
      this.email,
      this.apiKey,
    ]);

    return uid;
  }
}
