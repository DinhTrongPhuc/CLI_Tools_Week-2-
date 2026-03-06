#!/usr/bin/env node
import "dotenv/config";

import { TicketService } from "./domain/services/TicketService.js";
import { RepositoryFactory } from "./adapters/RepositoryFactory.js";
import { Menu } from "./adapters/primary/cli/Menu.js";
import { TicketCommands } from "./adapters/primary/cli/TicketCommands.js";

const repo = RepositoryFactory.create();
const service = new TicketService(repo);

// command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  // command mode
  const commands = new TicketCommands(service);
  commands.run(args);
} else {
  // menu mode
  new Menu(service).start();
}
