// inbound port

import { Ticket } from "../../domain/entities/Ticket.js";

export interface TicketUseCases {
  createTicket(
    title: string,
    description: string,
    tags: string[],
    iSoLuong: number,
  ): Promise<Ticket>;

  listTickets(): Promise<Ticket[]>;

  findTicket(id: number): Promise<Ticket>;

  updateStatus(id: number, status: string): Promise<Ticket>;
}
