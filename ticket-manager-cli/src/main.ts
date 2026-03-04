#!/usr/bin/env node
import "dotenv/config";
import { TicketService } from "./domain/services/TicketService.js";
import { JsonTicketRepository } from "./adapters/secondary/repositories/JsonTicketRepository.js";
// import { FetchHttpClient } from "./adapters/secondary/odoo/http/FetchHttpClient.js";
import { OdooTicketRepository } from "./adapters/secondary/odoo/OdooTicketRepository.js";
import { Menu } from "./adapters/primary/cli/Menu.js";

const useOdoo = process.env.USE_ODOO === "true";

let service: TicketService;

if (useOdoo) {
  const repo = new OdooTicketRepository(
    process.env.ODOO_BASE_URL!,
    process.env.ODOO_DB!,
    process.env.ODOO_EMAIL!,
    process.env.ODOO_API_KEY!,
  );

  service = new TicketService(repo);
} else {
  const repo = new JsonTicketRepository();
  service = new TicketService(repo);
}

new Menu(service).start();
