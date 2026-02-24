//serive chứa các business logic phức tạp liên quan đến enitities

import { Ticket, TicketPriority, TicketStatus } from "../entities/Ticket.js";
import { TicketValidator } from "../validators/TicketValidator.js";
import { TicketRepository } from "../../ports/outbound/TicketRepository.js";
import { TicketUseCases } from "../../ports/inbound/TicketUseCases.js";

export class TicketService implements TicketUseCases {
  constructor(private readonly repo: TicketRepository) {}

  async createTicket(
    title: string,
    description: string,
    tags: string[],
    iSoLuong: number,
  ) {
    //bug log while enter input
    TicketValidator.validateTitle(title);
    TicketValidator.validateiSoluong(iSoLuong);

    const id = await this.repo.getNextId();

    const ticket = new Ticket(
      id,
      title,
      description,
      TicketStatus.IN_PROGRESS, // default
      TicketPriority.MEDIUM, // default
      tags,
      iSoLuong,
      new Date(),
    );

    await this.repo.save(ticket);
    return ticket;
  }

  async listTickets() {
    return this.repo.findAll();
  }

  async findTicket(id: number) {
    const ticket = await this.repo.findById(id);
    if (!ticket) throw new Error("Ticket not found");
    return ticket;
  }

  async updateStatus(id: number, status: string) {
    const ticket = await this.findTicket(id);

    const newStatus = status as TicketStatus;
    TicketValidator.validateStatus(newStatus);

    ticket.status = newStatus;

    await this.repo.update(ticket);
    return ticket;
  }

  async updatePriority(id: number, priority: string) {
    const ticket = await this.findTicket(id);

    const newPriority = priority as TicketPriority;
    TicketValidator.validatePriority(newPriority);

    ticket.priority = newPriority;

    await this.repo.update(ticket);
    return ticket;
  }
}
