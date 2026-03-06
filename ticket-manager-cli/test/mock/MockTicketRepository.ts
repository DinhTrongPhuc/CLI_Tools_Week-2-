//test outbound port with mock data
import { TicketRepository } from "../../src/ports/outbound/TicketRepository.js";
import { Ticket, TicketStatus } from "../../src/domain/entities/Ticket.js";

export class MockTicketRepository implements TicketRepository {
  private tickets: Ticket[] = [];
  private idCounter = 1;

  async save(ticket: Ticket): Promise<Ticket> {
    ticket.id = this.idCounter++;
    this.tickets.push(ticket);
    return ticket;
  }

  async findAll(): Promise<Ticket[]> {
    return this.tickets;
  }

  async findById(id: number): Promise<Ticket | null> {
    return this.tickets.find((t) => t.id === id) || null;
  }

  async getNextId(): Promise<number> {
    return this.idCounter++;
  }

  async update(ticket: Ticket): Promise<void> {
    const index = this.tickets.findIndex((t) => t.id === ticket.id);
    if (index !== -1) this.tickets[index] = ticket;
  }

  async delete(id: number): Promise<void> {
    const index = this.tickets.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error("Ticket not found");
    }

    this.tickets.splice(index, 1);
  }

  async findUnprocessed(): Promise<Ticket[]> {
    return this.tickets.filter((t) => t.status !== TicketStatus.DONE);
  }
}
