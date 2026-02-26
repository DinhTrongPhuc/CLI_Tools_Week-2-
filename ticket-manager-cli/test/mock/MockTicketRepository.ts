//test outbound port with mock data
import { TicketRepository } from "../../src/ports/outbound/TicketRepository.js";
import { Ticket } from "../../src/domain/entities/Ticket.js";

export class MockTicketRepository implements TicketRepository {
  private tickets: Ticket[] = [];
  private id = 1;

  async save(ticket: Ticket): Promise<void> {
    this.tickets.push(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    return this.tickets;
  }

  async findById(id: number): Promise<Ticket | null> {
    return this.tickets.find((t) => t.id === id) || null;
  }

  async getNextId(): Promise<number> {
    return this.id++;
  }

  async update(ticket: Ticket): Promise<void> {
    const index = this.tickets.findIndex((t) => t.id === ticket.id);
    if (index !== -1) this.tickets[index] = ticket;
  }
}
