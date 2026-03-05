import { TicketRepository } from "../ports/outbound/TicketRepository.js";
import { OdooTicketRepository } from "./secondary/odoo/OdooTicketRepository.js";
import { JsonTicketRepository } from "./secondary/repositories/JsonTicketRepository.js";

export class RepositoryFactory {
  static create(): TicketRepository {
    const useOdoo = process.env.USE_ODOO === "true";

    if (useOdoo) {
      console.log("Using Odoo Repository");
      return new OdooTicketRepository(
        process.env.ODOO_BASE_URL!,
        process.env.ODOO_DB!,
        process.env.ODOO_EMAIL!,
        process.env.ODOO_API_KEY!,
      );
    }

    console.log("Using JSON Repository");
    return new JsonTicketRepository();
  }
}
