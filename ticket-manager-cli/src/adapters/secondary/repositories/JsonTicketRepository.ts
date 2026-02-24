import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { Ticket } from "../../../domain/entities/Ticket.js";
import { TicketRepository } from "../../../ports/outbound/TicketRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class JsonTicketRepository implements TicketRepository {
  private filePath = path.join(__dirname, "../../../../data/tickets.json");

  private async ensureFile() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.mkdir(path.dirname(this.filePath), { recursive: true });
      await fs.writeFile(this.filePath, "[]");
    }
  }

  private async read(): Promise<any[]> {
    await this.ensureFile();
    const data = await fs.readFile(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  private async write(data: any[]) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async getNextId(): Promise<number> {
    const tickets = await this.read();
    if (tickets.length === 0) return 1;
    return Math.max(...tickets.map((t) => t.id)) + 1;
  }

  async save(ticket: Ticket): Promise<void> {
    const tickets = await this.read();
    tickets.push({
      ...ticket,
      createdAt: ticket.createdAt.toISOString(),
    });
    await this.write(tickets);
  }

  async findAll(): Promise<Ticket[]> {
    const tickets = await this.read();
    return tickets.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
    }));
  }

  async findById(id: number): Promise<Ticket | null> {
    const tickets = await this.read();
    const found = tickets.find((t) => t.id === id);
    if (!found) return null;
    return {
      ...found,
      createdAt: new Date(found.createdAt),
    };
  }

  async update(ticket: Ticket): Promise<void> {
    const tickets = await this.read();
    const index = tickets.findIndex((t) => t.id === ticket.id);
    if (index === -1) throw new Error("Ticket not found");

    tickets[index] = {
      ...ticket,
      createdAt: ticket.createdAt.toISOString(),
    };

    await this.write(tickets);
  }
}
