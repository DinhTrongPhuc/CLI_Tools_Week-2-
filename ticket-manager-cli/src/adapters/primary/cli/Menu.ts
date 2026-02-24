//  Adapater/ primary(Driving)/ CLI chứa UI commandline interface - giao diện command

// readline module for entering input from keyboard to terminal
import readline from "readline";

// inbound(primary) adapter import(connect) to inbound port which is being implements by services
import { TicketService } from "../../../domain/services/TicketService.js";
import { TicketStatus } from "../../../domain/entities/Ticket.js";
import { TicketPriority } from "../../../domain/entities/Ticket.js";

export class Menu {
  constructor(private service: TicketService) {}

  start() {
    // declaration terminal interface for in/out
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const showMenu = () => {
      console.log("\n-----Ticket Manager-----");
      console.log("1. Create Ticket");
      console.log("2. List Tickets");
      console.log("3. Find Ticket");
      console.log("4. Update Status");
      console.log("5. Update Priority");
      console.log("6. Update all Detail"); // ongoing
      console.log("7. Delete Ticket "); //ongoing
      console.log("0. Exit");
      console.log("-----Ticket Manager-----");

      //question method
      rl.question("\nCHOOSE: ", async (answer) => {
        try {
          switch (answer) {
            case "1":
              await this.createTicket(rl);
              break;
            case "2":
              console.table(await this.service.listTickets());
              break;
            case "3":
              rl.question("Enter ID: ", async (id) => {
                console.log(await this.service.findTicket(Number(id)));
                showMenu();
              });
              return;
            case "4":
              rl.question("Enter ID: ", async (id) => {
                rl.question(
                  "New Status (open | in-process | done): ",
                  async (status) => {
                    if (
                      !Object.values(TicketStatus).includes(
                        status as TicketStatus,
                      )
                    ) {
                      console.log("Invalid status");
                      showMenu();
                      return;
                    }

                    console.log(
                      await this.service.updateStatus(
                        Number(id),
                        status as TicketStatus,
                      ),
                    );
                    showMenu();
                  },
                );
              });
              return;
            case "5":
              rl.question("Enter ID: ", async (id) => {
                rl.question(
                  "New Priority (low | medium | high): ",
                  async (priority) => {
                    if (
                      !Object.values(TicketPriority).includes(
                        priority as TicketPriority,
                      )
                    ) {
                      console.log(" Invalid priority");
                      showMenu();
                      return;
                    }

                    console.log(
                      await this.service.updatePriority(
                        Number(id),
                        priority as TicketPriority,
                      ),
                    );
                    showMenu();
                  },
                );
              });
              return;
              rl;
            case "0":
              rl.close();
              return;
          }
        } catch (err: any) {
          console.error("Error: ", err.message);
        }

        showMenu();
      });
    };

    showMenu();
  }

  private async createTicket(rl: readline.Interface) {
    return new Promise<void>((resolve) => {
      rl.question("Title: ", async (title) => {
        rl.question("Description: ", async (description) => {
          rl.question("Tags (comma): ", async (tags) => {
            rl.question("So Luong (integer): ", async (soLuong) => {
              const iSoLuong: number = parseInt(soLuong, 10);
              const ticket = await this.service.createTicket(
                title,
                description,
                tags ? tags.split(",") : [],
                iSoLuong,
              );
              console.log("Succese Created:", ticket);
              resolve();
            });
          });
        });
      });
    });
  }
}
