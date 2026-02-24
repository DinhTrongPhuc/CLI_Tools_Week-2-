#!/usr/bin/env node

import { JsonTicketRepository } from "./adapters/secondary/repositories/JsonTicketRepository.js";
import { TicketService } from "./domain/services/TicketService.js";
import { Menu } from "./adapters/primary/cli/Menu.js";

const repo = new JsonTicketRepository();
const service = new TicketService(repo);

new Menu(service).start();
