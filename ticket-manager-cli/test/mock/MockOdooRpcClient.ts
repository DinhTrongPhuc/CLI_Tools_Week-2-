export class MockOdooRpcClient {
  private tasks: any[] = [
    {
      id: 1,
      name: "Fix login bug",
      description: "Users cannot login",
      create_date: "2026-03-01T10:00:00Z",
      stage_id: { name: "New" },
    },
    {
      id: 2,
      name: "Payment error",
      description: "Stripe timeout",
      create_date: "2026-03-02T11:00:00Z",
      stage_id: { name: "In Progress" },
    },
  ];

  async call(service: string, method: string, params: any[]) {
    const model = params[3];
    const action = params[4];

    if (model !== "project.task") {
      throw new Error("Unknown model");
    }

    // search_read
    if (action === "search_read") {
      return this.tasks;
    }

    // create
    if (action === "create") {
      const data = params[5][0];

      const newTask = {
        id: this.tasks.length + 1,
        name: data.name,
        description: data.description,
        create_date: new Date().toISOString(),
      };

      this.tasks.push(newTask);

      return newTask.id;
    }

    // unlink
    if (action === "unlink") {
      const id = params[5][0];

      this.tasks = this.tasks.filter((t) => t.id !== id);

      return true;
    }

    throw new Error("Unsupported action");
  }
}
