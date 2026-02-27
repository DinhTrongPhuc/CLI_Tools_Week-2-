// outbound port nơi định nghĩa các hợp đồng interface kỹ thuật để tương tác với các ứng dụng bên ngoài (database,API,...)

import { Ticket } from "../../domain/entities/Ticket.js";

export interface TicketRepository {
  save(ticket: Ticket): Promise<void>;

  findAll(): Promise<Ticket[]>;

  findById(id: number): Promise<Ticket | null>;

  update(ticket: Ticket): Promise<void>;

  getNextId(): Promise<number>;
}
