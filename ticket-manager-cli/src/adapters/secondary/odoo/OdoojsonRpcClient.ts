export class OdooJsonRpcClient {
  constructor(private readonly baseUrl: string) {}

  async call(service: string, method: string, params: any) {
    const response = await fetch(`${this.baseUrl}/jsonrpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          service,
          method,
          args: params,
        },
        id: Date.now(),
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.data.message);
    }

    return data.result;
  }
}
