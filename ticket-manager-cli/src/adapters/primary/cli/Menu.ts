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
      console.log("4. Delete Ticket ");
      console.log(" ____ JSON REPOSITORY_________");
      console.log("5. Update Status");
      console.log("6. Update Priority");
      console.log("7. Update all Detail Ticket");
      console.log("____ ODoo REPOSITORY_________");
      console.log("8. Unprocessed Tickets");
      console.log("9. Tickets New");
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
              await this.listTickets();
              break;
            case "3":
              rl.question("Enter ID: ", async (id) => {
                console.log(await this.service.findTicket(Number(id)));
                showMenu();
              });
              return;
            case "5":
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
            case "6":
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
            case "7":
              await this.updateFullTicket(rl);
              break;
            case "4":
              rl.question("Enter ID to delete: ", async (id) => {
                try {
                  await this.service.deleteTicket(Number(id));
                  console.log("Ticket delete");
                } catch (err: any) {
                  console.log(err.message);
                }
                showMenu();
              });
              return;
            case "8":
              const tickets = await this.service.getUnprocessedTickets();

              console.log("\nUnprocessed tickets:");

              tickets.forEach((t) => {
                console.log(`${t.id} - ${t.title}`);
              });
              break;
            case "9":
              if (!("findNewTickets" in this.service["repo"])) {
                console.log("This command only works with Odoo repository");
                break;
              }
              const ticket = await this.service.getNewTickets();

              console.table(
                ticket.map((t: any) => ({
                  id: t.id,
                  title: t.title,
                  createdAt: t.createdAt,
                })),
              );
              break;

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

  private async listTickets() {
    const tickets = await this.service.listTickets();

    if (!tickets.length) {
      console.log("\nNo tasks found.\n");
      return;
    }

    console.log("\n====================================");
    console.log("        ODOO PROJECT TASKS");
    console.log("====================================\n");

    tickets.forEach((t, index) => {
      console.log(`[${index + 1}] ID: ${t.id}`);
      console.log(`Title : ${t.title}`);
      console.log(`Desc  : ${t.description}`);
      console.log("------------------------------------");
    });
  }

  private async updateFullTicket(rl: readline.Interface) {
    return new Promise<void>((resolve) => {
      rl.question("Enter ID: ", async (idInput) => {
        const id = Number(idInput);

        rl.question("New Title: ", async (title) => {
          rl.question("New Description: ", async (description) => {
            rl.question("New Tags (comma): ", async (tagsInput) => {
              rl.question(
                "New Status (open | in-process | done): ",
                async (statusInput) => {
                  rl.question(
                    "New Priority (low | medium | high): ",
                    async (priorityInput) => {
                      rl.question(
                        "New SoLuong (integer): ",
                        async (soLuongInput) => {
                          try {
                            const soLuong = parseInt(soLuongInput, 10);

                            if (
                              !Object.values(TicketStatus).includes(
                                statusInput as TicketStatus,
                              )
                            ) {
                              console.log("Invalid status");
                              resolve();
                              return;
                            }

                            if (
                              !Object.values(TicketPriority).includes(
                                priorityInput as TicketPriority,
                              )
                            ) {
                              console.log("Invalid priority");
                              resolve();
                              return;
                            }

                            const updated = await this.service.updateTicket(
                              id,
                              {
                                title,
                                description,
                                tags: tagsInput ? tagsInput.split(",") : [],
                                status: statusInput as TicketStatus,
                                priority: priorityInput as TicketPriority,
                                soLuong,
                              },
                            );

                            console.log("Updated:", updated);
                          } catch (err: any) {
                            console.error("Error:", err.message);
                          }

                          resolve();
                        },
                      );
                    },
                  );
                },
              );
            });
          });
        });
      });
    });
  }
}
