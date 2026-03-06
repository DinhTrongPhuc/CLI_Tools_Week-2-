import { TicketService } from "../../src/domain/services/TicketService.js";
import { OdooTicketRepository } from "../../src/adapters/secondary/odoo/OdooTicketRepository.js";
import { MockOdooRpcClient } from "../mock/MockOdooRpcClient.js";

describe("OdooTicketRepository Integration", () => {
  let service: TicketService;

  beforeEach(() => {
    const repo = new OdooTicketRepository(
      "http://fake-odoo",
      "test_db",
      "test@mail.com",
      "fake_key",
    );

    // inject mock rpc
    (repo as any).rpc = new MockOdooRpcClient();
    (repo as any).uid = 1;

    service = new TicketService(repo);
  });

  test("should list tickets from Odoo", async () => {
    const tickets = await service.listTickets();

    expect(tickets.length).toBe(2);
    expect(tickets[0]!.title).toBe("Fix login bug");
  });

  test("should create ticket in Odoo", async () => {
    const ticket = await service.createTicket(
      "New Bug",
      "Something broken",
      [],
      1,
    );

    expect(ticket.title).toBe("New Bug");
  });

  test("should delete ticket", async () => {
    await expect(service.deleteTicket(1)).resolves.not.toThrow();
  });

  test("should return unprocessed tickets", async () => {
    const tickets = await service.getUnprocessedTickets();

    expect(tickets.length).toBeGreaterThan(0);
  });

  test("should find ticket by id", async () => {
    const ticket = await service.findTicket(1);

    expect(ticket!.id).toBe(1);
  });
});
