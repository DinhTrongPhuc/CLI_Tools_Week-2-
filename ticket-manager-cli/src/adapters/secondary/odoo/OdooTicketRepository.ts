import { TicketRepository } from "../../../ports/outbound/TicketRepository.js";
import { Ticket } from "../../../domain/entities/Ticket.js";
import { OdooJsonRpcClient } from "./OdooJsonRpcClient.js";
import { OdooAuthService } from "./OdooAuthService.js";

export class OdooTicketRepository implements TicketRepository {
  private uid!: number;

  constructor(
    private readonly baseUrl: string,
    private readonly db: string,
    private readonly email: string,
    private readonly apiKey: string,
  ) {}

  private async init() {
    if (!this.uid) {
      const rpc = new OdooJsonRpcClient(this.baseUrl);
      const auth = new OdooAuthService(rpc, this.db, this.email, this.apiKey);
      this.uid = await auth.login();
    }
  }

  async findAll(): Promise<Ticket[]> {
    await this.init();

    const rpc = new OdooJsonRpcClient(this.baseUrl);

    const tasks = await rpc.call("object", "execute_kw", [
      this.db,
      this.uid,
      this.apiKey,
      "project.task",
      "search_read",
      [[]],
      { fields: ["id", "name", "description"] },
    ]);

    return tasks.map(
      (t: any) =>
        new Ticket(
          t.id,
          t.name,
          t.description ?? "",
          "in_progress" as any,
          "medium" as any,
          [],
          0,
          new Date(),
        ),
    );
  }

  async findById(id: number): Promise<Ticket | null> {
    throw new Error("Not implemented yet");
  }

  async save(ticket: Ticket) {
    throw new Error("Not implemented yet");
  }

  async update(ticket: Ticket) {
    throw new Error("Not implemented yet");
  }

  async delete(id: number) {
    throw new Error("Not implemented yet");
  }

  async getNextId(): Promise<number> {
    throw new Error("Odoo handles ID");
  }
}
