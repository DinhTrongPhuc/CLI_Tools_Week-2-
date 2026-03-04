import { HttpClientPort } from "../../../../ports/outbound/HttpClientPort.js";

export class FetchHttpClient implements HttpClientPort {
  async get<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GET ${url} failed: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(
    url: string,
    body: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`POST ${url} failed: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(
    url: string,
    body: any,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PUT ${url} failed: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`DELETE ${url} failed: ${response.status}`);
    }

    return response.json();
  }
}
