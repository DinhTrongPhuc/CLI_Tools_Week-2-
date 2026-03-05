#!/usr/bin/env node
import "dotenv/config";

import { TicketService } from "./domain/services/TicketService.js";
import { RepositoryFactory } from "./adapters/RepositoryFactory.js";
import { Menu } from "./adapters/primary/cli/Menu.js";

const repo = RepositoryFactory.create();
const service = new TicketService(repo);

new Menu(service).start();
