# Ticket Manager CLI – Hexagonal Architecture + Odoo API

A professional CLI tool for managing tickets/tasks built with **Hexagonal Architecture** and **Odoo API integration**.

This application enables support agents to manage tickets through a **Command Line Interface (CLI)** with support for two storage adapters:

- **JSON Repository** (local file storage)
- **Odoo Repository** (remote Odoo API)

The architecture separates **business logic** from **infrastructure**, making it easy to switch between storage implementations.

---

## Summary

This project demonstrates:

- Implementation of **Hexagonal Architecture** (Ports & Adapters)
- Integration with **external API (Odoo)**
- **CLI interface** for ticket management
- **Repository pattern** with dynamic adapter switching
- **Comprehensive testing** with unit and integration tests
- **Mock API testing** without real Odoo dependency
- **Clean code** with TypeScript and proper separation of concerns

---

## 🏗️ Architecture

This project follows **Hexagonal Architecture (Ports & Adapters)** pattern.

```
test/
├── domain/
└── mock/
src/
├── domain/                    # Core business logic
│   ├── entities/              # Business entities (Ticket)
│   ├── services/              # Business rules and operations
│   └── validators/            # Domain validation logic
│
├── ports/                     # Interfaces (contracts)
│   ├── inbound/               # Input interfaces (use cases)
│   └── outbound/              # Output interfaces (repositories)
│
└── adapters/                  # Implementations
    ├── primary/               # CLI interface (user interaction)
    └── secondary/             # Data adapters (JSON / Odoo)
```

### Layer Responsibilities

| Layer        | Responsibility                       | Examples                                                |
| ------------ | ------------------------------------ | ------------------------------------------------------- |
| **Domain**   | Business rules, entities, validation | `TicketService`, `Ticket` entity, validators            |
| **Ports**    | Define interfaces for communication  | `interface TicketUsecase`, `interface TicketRepository` |
| **Adapters** | Implement external systems           | CLI, JSON Repository, Odoo Repository                   |

### Why Hexagonal Architecture?

- **Independence**: Business logic is independent of frameworks and databases
- **Testability**: Easy to test with mock implementations
- **Flexibility**: Switch between JSON and Odoo without changing domain code
- **Maintainability**: Clear separation of concerns

---

## ✨ Project Features

### Ticket Operations

- Create new ticket
- List all tickets
- Find ticket by ID
- Delete ticket
- Show unprocessed tickets
- Show newest ticket
- Update ticket status/ priority/ all details - JSon Repository

### CLI Commands

The CLI supports both **interactive menu** and **direct command-line commands**.

#### Interactive Mode

```bash
npm run dev
```

Then select from the menu:

1. Create new ticket
2. List all tickets
3. Find ticket by ID
4. Delete ticket
5. Show unprocessed tickets

#### Command Mode

```bash
# List all tickets
npm run dev ticket list

# Create new ticket
npm run dev ticket new

# Show ticket by ID
npm run dev ticket show <id>

# Show unprocessed tickets
npm run dev ticket unprocessed

# Delete ticket
npm run dev ticket delete <id>
```

---

## 🔌 Odoo API Integration

The project integrates with **Odoo JSON-RPC API** to manage tasks remotely.

### Supported Operations

- Authenticate with Odoo using API key
- Retrieve tasks from `project.task` model
- Create new task
- Delete task
- Query unprocessed tasks

### Odoo Endpoint

```
https://your-domain.odoo.com/jsonrpc
```

### Odoo Data Mapping

| Odoo Field    | Ticket Field  | Description       |
| ------------- | ------------- | ----------------- |
| `id`          | `id`          | Unique identifier |
| `name`        | `title`       | Task title        |
| `description` | `description` | Task details      |
| `priority`    | `priority`    | Priority level    |
| `stage_id`    | `status`      | Task stage/status |
| `tag_ids`     | `tags`        | Associated tags   |

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
# Repository Mode
USE_ODOO=true

# Odoo Configuration
ODOO_BASE_URL=https://your-odoo-domain.odoo.com
ODOO_DB=your_database_name
ODOO_EMAIL=your_email@example.com
ODOO_API_KEY=your_api_key_here
```

### Adapter Switching

The project can dynamically switch between repositories:

```env
USE_ODOO=true   # → Use Odoo API repository
USE_ODOO=false  # → Use JSON file repository
```

This is implemented using the **RepositoryFactory** pattern in `src/adapters/secondary/RepositoryFactory.ts`.

---

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

### Run Specific Command

```bash
# List tickets
npm run dev ticket list

# Create ticket
npm run dev ticket new

# Show ticket
npm run dev ticket show 1

# Delete ticket
npm run dev ticket delete 1
```

---

## 🧪 Testing

The project uses **Jest** for comprehensive testing.

### Run All Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

---

## 🧪 Testing Strategy

### 1. Domain Tests (Unit Tests)

Unit tests verify **business logic in the domain layer** using mock repositories.

**Tested Scenarios:**

- Create ticket with valid data
- Update ticket status
- Delete ticket
- Validation logic (required fields, priority values)
- Business rules enforcement

**Location:** `test/domain/`

**Example:**

```typescript
describe("TicketService", () => {
  let service: TicketService;

  beforeEach(() => {
    const repo = new MockTicketRepository();
    service = new TicketService(repo);
  });

  test("should create ticket", async () => {
    const ticket = await service.createTicket(
      "Bug login",
      "Cannot login",
      ["bug"],
      2,
    );

    expect(ticket.id).toBe(1);
    expect(ticket.title).toBe("Bug login");
    expect(ticket.status).toBe(TicketStatus.IN_PROGRESS); // default
    expect(ticket.priority).toBe(TicketPriority.MEDIUM); // default
  });
});
```

### 2. Integration Tests (Mock Odoo API)

Integration tests simulate Odoo API behavior using **MockOdooRpcClient**.

The mock client emulates Odoo RPC responses without calling the real API.

**Tested Scenarios:**

- Fetch tasks from Odoo
- Create tasks with Odoo format
- Delete tasks
- Query unprocessed tasks
- Error handling

**Location:** `test/integration/`

**Mock Implementation:** `test/mock/MockOdooRpcClient.ts`

**Example:**

```typescript
describe("OdooTicketRepository", () => {
  it("should fetch all tickets from Odoo", async () => {
    const mockClient = new MockOdooRpcClient();
    const repo = new OdooTicketRepository(mockClient);
    const tickets = await repo.findAll();
    expect(tickets).toHaveLength(2);
  });
});
```

---

## 🔄 Data Flow

### Example Flow: List All Tickets

```
npm run dev ticket list
         ↓
CLI Command Parser
         ↓
Menu / Command Handler
         ↓
TicketService (Domain)
         ↓
ITicketRepository (Port)
         ↓
OdooTicketRepository (Adapter)
         ↓
Odoo RPC Client
         ↓
Odoo JSON-RPC API
         ↓
Response flows back up
```

### Key Benefits of This Flow

- **Business logic** (`TicketService`) is independent of infrastructure
- **Repositories** can be swapped without changing domain code
- **Testing** is easy with mock implementations
- **Flexibility** to add new adapters (e.g., PostgreSQL, MongoDB)

---

## 📊 Example Ticket Data

```json
{
  "id": 10,
  "title": "Login bug",
  "description": "Users cannot login to the system",
  "status": "in_progress",
  "priority": "medium",
  "tags": ["bug", "authentication"],
  "iSoLuong": 1,
  "createdAt": "2026-03-04T11:21:34.973Z"
}
```

### Status Values

- `in_progress` – Being worked on
- `done` – Completed
- `open` – Available

### Priority Values

- `low` – Low priority
- `medium` – Medium priority
- `high` – High priority

---

## 📁 Project Structure

```
ticket-manager-cli/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Ticket.ts
│   │   ├── services/
│   │   │   └── TicketService.ts
│   │   └── validators/
│   │       └── TicketValidator.ts
│   ├── ports/
│   │   ├── inbound/
│   │   │   └── ITicketService.ts
│   │   └── outbound/
│   │       └── ITicketRepository.ts
│   └── adapters/
│       ├── primary/
│       │   └── cli/
│       │       ├── TicketCLI.ts
│       │       └── commands/
│       └── secondary/
│           ├── JsonTicketRepository.ts
│           ├── OdooTicketRepository.ts
│           ├── OdooRpcClient.ts
│           └── RepositoryFactory.ts
├── test/
│   ├── domain/
│   ├── integration/
│   └── mock/
│       └── MockOdooRpcClient.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 Installation

### Install Dependencies

```bash
npm install
```

### Development Dependencies

```bash
npm install -D @types/node ts-node typescript tsx
```

### Testing Dependencies

```bash
npm install -D jest ts-jest @types/jest
```

---

## 📝 Project Configuration

The project uses TypeScript with ES modules support.

**Important settings in `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "es2022",
    "moduleResolution": "nodenext",
    "esModuleInterop": true,
    "verbatimModuleSyntax": false,
    "types": ["node", "jest"]
  }
}
```

**settings in `package.json`:**

```json
{
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
    "test:watch": "jest --watch",
    "dev": "tsx src/main.ts"
  },
  "type": "module"
}
```
