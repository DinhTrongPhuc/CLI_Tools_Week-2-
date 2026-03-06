// inbound port

import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "../../domain/entities/Ticket.js";

export interface TicketUseCases {
  createTicket(
    // readonly id: number,
    title: string,
    description: string,
    tags: string[],
    iSoLuong: number,
    // priority: TicketPriority,
    // status: TicketStatus,
    // createdAt: Date,
  ): Promise<Ticket>;

  listTickets(): Promise<Ticket[]>;

  findTicket(id: number): Promise<Ticket>;

  updateTicket(
    id: number,
    data: {
      title: string;
      description: string;
      tags: string[];
      priority: TicketPriority;
      status: TicketStatus;
      soLuong: number;
    },
  ): Promise<Ticket>;

  deleteTicket(id: number): Promise<void>;
}
