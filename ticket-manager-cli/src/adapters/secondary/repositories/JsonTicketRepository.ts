// required function for read/write file from "types": ["node"]
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// import entity and matchup outbound port from domain
import { Ticket } from "../../../domain/entities/Ticket.js";
import { TicketRepository } from "../../../ports/outbound/TicketRepository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// outbound adapter(secondary) implements outbound port to read/write data to .json file
export class JsonTicketRepository implements TicketRepository {
  private filePath = path.join(__dirname, "../../../../data/tickets.json");

  // read/wirte file
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

  //autogenerate Id
  // async getNextId(): Promise<number> {
  //   const tickets = await this.read();
  //   if (tickets.length === 0) return 1;
  //   return Math.max(...tickets.map((t) => t.id)) + 1;
  // }

  async getNextId(): Promise<number> {
    const tickets = await this.read();

    if (tickets.length === 0) return 1;

    let maxId = tickets[0].id;

    for (let i = 1; i < tickets.length; i++) {
      if (tickets[i].id > maxId) {
        maxId = tickets[i].id;
      }
    }

    return maxId + 1;
  }

  // crud
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

  // async findAll(): Promise<Ticket[]> {
  //   const tickets = await this.read();
  //   const result: Ticket[] = [];

  //   for (let i = 0; i < tickets.length; i++) {
  //     const t = tickets[i];

  //     result.push({
  //       ...t,
  //       createdAt: new Date(t.createdAt),
  //     });
  //   }

  //   return result;
  // }

  async findById(id: number): Promise<Ticket | null> {
    const tickets = await this.read();
    const found = tickets.find((t) => t.id === id);
    if (!found) return null;
    return {
      ...found,
      createdAt: new Date(found.createdAt),
    };
  }

  //   async findById(id: number): Promise<Ticket | null> {
  //   const tickets = await this.read();

  //   for (let i = 0; i < tickets.length; i++) {
  //     if (tickets[i].id === id) {
  //       return {
  //         ...tickets[i],
  //         createdAt: new Date(tickets[i].createdAt),
  //       };
  //     }
  //   }

  //   return null;
  // }

  async update(ticket: Ticket): Promise<void> {
    const tickets = await this.read();

    // const index = tickets.findIndex((t) => t.id === ticket.id);
    let index = -1;
    for (let i = 0; i < tickets.length; i++) {
      if (tickets[i].id === ticket.id) {
        index = i;
        break;
      }
    }

    if (index === -1) throw new Error("Ticket not found");

    tickets[index] = {
      ...ticket,
      createdAt: ticket.createdAt.toISOString(),
    };

    await this.write(tickets);
  }

  async delete(id: number): Promise<void> {
    const tickets = await this.read();

    const index = tickets.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Ticket not found");
    }

    tickets.splice(index, 1);

    await this.write(tickets);
  }
}
