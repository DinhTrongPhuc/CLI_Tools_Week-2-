import {
  TicketPriority,
  TicketStatus,
} from "../../src/domain/entities/Ticket.js";
import { TicketService } from "../../src/domain/services/TicketService.js";
import { MockTicketRepository } from "../mock/MockTicketRepository.js";

describe("TicketService", () => {
  let service: TicketService;

  beforeEach(() => {
    const repo = new MockTicketRepository();
    service = new TicketService(repo);
  });

  test("should create ticket", async () => {
    const ticket = await service.createTicket(
      "Bug login",
      "Cannot login",
      ["bug"],
      2,
    );

    expect(ticket.id).toBe(1);
    expect(ticket.title).toBe("Bug login");
    expect(ticket.status).toBe(TicketStatus.IN_PROGRESS); // default
    expect(ticket.priority).toBe(TicketPriority.MEDIUM); // default
  });

  test("should throw error if title empty", async () => {
    await expect(service.createTicket("", "desc", [], 1)).rejects.toThrow(
      "Title cannot be empty",
    );
  });

  test("should list tickets", async () => {
    await service.createTicket("T1", "", [], 1);
    await service.createTicket("T2", "", [], 1);

    const tickets = await service.listTickets();

    expect(tickets.length).toBe(2);
  });

  test("should update status", async () => {
    const ticket = await service.createTicket("Bug", "", [], 1);

    const updated = await service.updateStatus(ticket.id, TicketStatus.DONE);

    expect(updated.status).toBe(TicketStatus.DONE);
  });

  test("should throw if ticket not found", async () => {
    await expect(service.findTicket(999)).rejects.toThrow("Ticket not found");
  });
});
