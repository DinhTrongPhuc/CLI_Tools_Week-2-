import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from "../../../domain/entities/Ticket.js";

export class OdooMapper {
  static toDomain(data: any): Ticket {
    return new Ticket(
      data.id,
      data.title,
      data.description,
      data.status as TicketStatus,
      data.priority as TicketPriority,
      data.tags ?? [],
      data.iSoLuong ?? 0,
      new Date(data.created_at),
    );
  }

  static toPersistence(ticket: Ticket): any {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      tags: ticket.tags,
      iSoLuong: ticket.iSoLuong,
    };
  }
}
