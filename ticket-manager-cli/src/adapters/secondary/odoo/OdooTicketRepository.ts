import "dotenv/config";
import { TicketRepository } from "../../../ports/outbound/TicketRepository.js";
import { Ticket } from "../../../domain/entities/Ticket.js";
import { OdooJsonRpcClient } from "./OdooJsonRpcClient.js";
import { OdooAuthService } from "./OdooAuthService.js";

export class OdooTicketRepository implements TicketRepository {
  private uid!: number;
  private rpc: OdooJsonRpcClient;

  constructor(
    private readonly baseUrl: string,
    private readonly db: string,
    private readonly email: string,
    private readonly apiKey: string,
  ) {
    this.rpc = new OdooJsonRpcClient(this.baseUrl);
  }

  private async init() {
    if (!this.uid) {
      const auth = new OdooAuthService(
        this.rpc,
        this.db,
        this.email,
        this.apiKey,
      );
      this.uid = await auth.login();
    }
  }

  private stripHtml(html: any): string {
    if (!html || typeof html !== "string") {
      return "";
    }

    return html.replace(/<[^>]*>?/gm, "").trim();
  }

  private truncate(text: string, maxLength = 80): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  async findAll(): Promise<Ticket[]> {
    await this.init();

    const tasks = await this.rpc.call("object", "execute_kw", [
      this.db,
      this.uid,
      this.apiKey,
      "project.task",
      "search_read",
      [[]],
      { fields: ["id", "name", "description"] },
    ]);

    return tasks.map((t: any) => {
      const cleanDescription = this.stripHtml(t.description ?? "");
      const shortDescription = this.truncate(cleanDescription);

      return new Ticket(
        t.id,
        t.name ?? "No title",
        shortDescription || "No description",
        "in_progress" as any,
        "medium" as any,
        [],
        0,
        new Date(),
      );
    });
  }

  async findById(id: number): Promise<Ticket | null> {
    await this.init();

    const result = await this.rpc.call("object", "execute_kw", [
      this.db,
      this.uid,
      this.apiKey,
      "project.task",
      "search_read",
      [[["id", "=", id]]],
      { fields: ["id", "name", "description"] },
    ]);

    if (!result.length) return null;

    const task = result[0];
    const cleanDescription = this.stripHtml(task.description ?? "");

    return new Ticket(
      task.id,
      task.name ?? "No title",
      cleanDescription,
      "in_progress" as any,
      "medium" as any,
      [],
      0,
      new Date(),
    );
  }

  async save(ticket: Ticket): Promise<Ticket> {
    await this.init();

    const id = await this.rpc.call("object", "execute_kw", [
      this.db,
      this.uid,
      this.apiKey,
      "project.task",
      "create",
      [
        {
          name: ticket.title,
          description: ticket.description,
        },
      ],
    ]);

    return new Ticket(
      id,
      ticket.title,
      ticket.description,
      ticket.status,
      ticket.priority,
      ticket.tags,
      ticket.iSoLuong,
      ticket.createdAt,
    );
  }

  async update(ticket: Ticket) {
    await this.init();

    await this.rpc.call("object", "execute_kw", [
      this.db,
      this.uid,
      this.apiKey,
      "project.task",
      "write",
      [
        [ticket.id],
        {
          name: ticket.title,
          description: ticket.description,
        },
      ],
    ]);
  }

  async delete(id: number) {
    await this.init();

    await this.rpc.call("object", "execute_kw", [
      this.db,
      this.uid,
      this.apiKey,
      "project.task",
      "unlink",
      [[id]],
    ]);
  }

  async getNextId(): Promise<number> {
    return 0; // Odoo auto generate ID
  }
}
