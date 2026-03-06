import { TicketService } from "../../../domain/services/TicketService.js";

export class TicketCommands {
  constructor(private service: TicketService) {}

  async run(args: string[]) {
    const [entity, action, param] = args;

    if (entity !== "tickets") {
      console.log("Unknown command");
      return;
    }

    switch (action) {
      case "list": {
        const tickets = await this.service.listTickets();
        console.log(tickets);
        break;
      }

      case "show": {
        const id = Number(param);
        const ticket = await this.service.findTicket(id);
        console.log(ticket);
        break;
      }

      case "new": {
        const ticket = await this.service.createTicket(
          "CLI Ticket",
          "Created from command line",
          [],
          1,
        );
        console.log(ticket);
        break;
      }

      case "unprocessed": {
        const tickets = await this.service.getUnprocessedTickets();
        console.log("\n", tickets);
        break;
      }

      default:
        console.log("Unknown command");
    }
  }
}
