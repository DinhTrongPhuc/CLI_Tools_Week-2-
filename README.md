# Ticket Manager CLI – Hexagonal Architecture + Odoo API

Một công cụ CLI chuyên nghiệp để quản lý tickets/tasks được xây dựng với **Hexagonal Architecture** và tích hợp **Odoo API**.

Ứng dụng này cho phép các support agents quản lý tickets thông qua **Command Line Interface (CLI)** với hỗ trợ hai storage adapters:

- **JSON Repository** (lưu trữ file cục bộ)
- **Odoo Repository** (remote Odoo API)

Kiến trúc này tách biệt **business logic** khỏi **infrastructure**, giúp dễ dàng chuyển đổi giữa các storage implementations.

---

## Tổng Quan

Dự án này minh họa:

- Triển khai **Hexagonal Architecture** (Ports & Adapters)
- Tích hợp với **external API (Odoo)**
- **CLI interface** để quản lý ticket
- **Repository pattern** với khả năng chuyển đổi adapter linh hoạt
- **Comprehensive testing** với unit tests và integration tests
- **Mock API testing** không phụ thuộc vào Odoo thật
- **Clean code** với TypeScript và phân tách rõ ràng các concerns

---

## 🏗️ Kiến Trúc

Dự án này tuân theo mô hình **Hexagonal Architecture (Ports & Adapters)**.

```
test/
├── domain/
└── mock/
src/
├── domain/                    # Core business logic
│   ├── entities/              # Business entities (Ticket)
│   ├── services/              # Business rules và operations
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

### Trách Nhiệm Của Từng Layer

| Layer        | Trách Nhiệm                          | Ví Dụ                                                   |
| ------------ | ------------------------------------ | ------------------------------------------------------- |
| **Domain**   | Business rules, entities, validation | `TicketService`, `Ticket` entity, validators            |
| **Ports**    | Định nghĩa interfaces để giao tiếp   | `interface TicketUsecase`, `interface TicketRepository` |
| **Adapters** | Triển khai các hệ thống bên ngoài    | CLI, JSON Repository, Odoo Repository                   |

### Tại Sao Sử Dụng Hexagonal Architecture?

- **Independence**: Business logic độc lập với frameworks và databases
- **Testability**: Dễ dàng test với mock implementations
- **Flexibility**: Chuyển đổi giữa JSON và Odoo mà không thay đổi domain code
- **Maintainability**: Phân tách rõ ràng các concerns

---

## ✨ Tính Năng Của Dự Án

### Các Thao Tác Với Ticket

- Tạo ticket mới
- Liệt kê tất cả tickets
- Tìm ticket theo ID
- Xóa ticket
- Hiển thị các tickets chưa xử lý
- Hiển thị ticket mới nhất
- Cập nhật status/ priority/ tất cả thông tin chi tiết - JSON Repository

### CLI Commands

CLI hỗ trợ cả **interactive menu** và **direct command-line commands**.

#### Interactive Mode

```bash
npm run dev
```

Sau đó chọn từ menu:

1. Tạo ticket mới
2. Liệt kê tất cả tickets
3. Tìm ticket theo ID
4. Xóa ticket
5. Hiển thị các tickets chưa xử lý

#### Command Mode

```bash
# Liệt kê tất cả tickets
npm run dev ticket list

# Tạo ticket mới
npm run dev ticket new

# Hiển thị ticket theo ID
npm run dev ticket show <id>

# Hiển thị tickets chưa xử lý
npm run dev ticket unprocessed

# Xóa ticket
npm run dev ticket delete <id>
```

---

## 🔌 Tích Hợp Odoo API

Dự án tích hợp với **Odoo JSON-RPC API** để quản lý tasks từ xa.

### Các Thao Tác Được Hỗ Trợ

- Xác thực với Odoo sử dụng API key
- Truy xuất tasks từ model `project.task`
- Tạo task mới
- Xóa task
- Truy vấn các tasks chưa xử lý

### Odoo Endpoint

```
https://your-domain.odoo.com/jsonrpc
```

### Ánh Xạ Dữ Liệu Odoo

| Odoo Field    | Ticket Field  | Mô Tả                     |
| ------------- | ------------- | ------------------------- |
| `id`          | `id`          | Định danh duy nhất        |
| `name`        | `title`       | Tiêu đề task              |
| `description` | `description` | Chi tiết task             |
| `priority`    | `priority`    | Mức độ ưu tiên            |
| `stage_id`    | `status`      | Giai đoạn/trạng thái task |
| `tag_ids`     | `tags`        | Các tags liên quan        |

---

## ⚙️ Cấu Hình Environment

Tạo file `.env` trong thư mục gốc của dự án:

```env
# Repository Mode
USE_ODOO=true

# Odoo Configuration
ODOO_BASE_URL=https://your-odoo-domain.odoo.com
ODOO_DB=your_database_name
ODOO_EMAIL=your_email@example.com
ODOO_API_KEY=your_api_key_here
```

### Chuyển Đổi Adapter

Dự án có thể chuyển đổi repositories một cách linh hoạt:

```env
USE_ODOO=true   # → Sử dụng Odoo API repository
USE_ODOO=false  # → Sử dụng JSON file repository
```

Điều này được triển khai thông qua pattern **RepositoryFactory** trong `src/adapters/secondary/RepositoryFactory.ts`.

---

## 🚀 Chạy Dự Án

### Development Mode

```bash
npm run dev
```

### Chạy Command Cụ Thể

```bash
# Liệt kê tickets
npm run dev ticket list

# Tạo ticket
npm run dev ticket new

# Hiển thị ticket
npm run dev ticket show 1

# Xóa ticket
npm run dev ticket delete 1
```

---

## 🧪 Testing

Dự án sử dụng **Jest** cho comprehensive testing.

### Chạy Tất Cả Tests

```bash
npm run test
```

### Chạy Tests Ở Watch Mode

```bash
npm run test:watch
```

---

## 🧪 Chiến Lược Testing

### 1. Domain Tests (Unit Tests)

Unit tests kiểm tra **business logic trong domain layer** sử dụng mock repositories.

**Các Kịch Bản Được Kiểm Tra:**

- Tạo ticket với dữ liệu hợp lệ
- Cập nhật ticket status
- Xóa ticket
- Validation logic (các trường bắt buộc, giá trị priority)
- Thực thi business rules

**Vị Trí:** `test/domain/`

**Ví Dụ:**

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

Integration tests mô phỏng hành vi của Odoo API sử dụng **MockOdooRpcClient**.

Mock client mô phỏng các responses từ Odoo RPC mà không gọi đến API thật.

**Các Kịch Bản Được Kiểm Tra:**

- Lấy tasks từ Odoo
- Tạo tasks với định dạng Odoo
- Xóa tasks
- Truy vấn các tasks chưa xử lý
- Xử lý lỗi

**Vị Trí:** `test/integration/`

**Mock Implementation:** `test/mock/MockOdooRpcClient.ts`

**Ví Dụ:**

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

## 🔄 Luồng Dữ Liệu

### Ví Dụ Luồng: Liệt Kê Tất Cả Tickets

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
Response trả ngược lại
```

### Lợi Ích Chính Của Luồng Này

- **Business logic** (`TicketService`) độc lập với infrastructure
- **Repositories** có thể được thay thế mà không cần thay đổi domain code
- **Testing** dễ dàng với mock implementations
- **Flexibility** để thêm adapters mới (ví dụ: PostgreSQL, MongoDB)

---

## 📊 Ví Dụ Dữ Liệu Ticket

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

### Các Giá Trị Status

- `in_progress` – Đang được xử lý
- `done` – Đã hoàn thành
- `open` – Có sẵn

### Các Giá Trị Priority

- `low` – Ưu tiên thấp
- `medium` – Ưu tiên trung bình
- `high` – Ưu tiên cao

---

## 📁 Cấu Trúc Dự Án

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

## 📦 Cài Đặt

### Cài Đặt Dependencies

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

## 📝 Cấu Hình Dự Án

Dự án sử dụng TypeScript với hỗ trợ ES modules.

**Các cài đặt quan trọng trong `tsconfig.json`:**

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

**Cài đặt trong `package.json`:**

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

---

# Tìm hiểu về MCP và Knowledge Base (vector)

## 1. MCP: Model Context Protocol

- Là giao thức open source đóng vai trò làm cầu nối cho phép các mô hình AI (LLM) dễ dàng kết nối, truy cập vào dữ liệu và sử dụng công cụ từ các hệ thống bên ngoài một cách an toàn và nhất quán.

- Chức năng: giúp AI "thông minh hơn" hiểu rõ ngữ cảnh hơn, truy cập dữ liệu thời gian thực và thực hiện các tác vụ phức tạp hơn thay vì để AI tự phản hồi bằng dữ liệu được đào tạo sẵn.

### Ví Dụ:

- Truyền thống (Không MCP): Khi cần AI tóm tắt nội dung Email, AI ko có quyền truy cập -> người dùng phải làm việc thủ công từ đăng nhập, tìm mail, copy nội dung, dán lại cho AI để AI làm việc => tốn thời gian, phụ thuộc vào con người, giới hạn context khi chỉ xử lý từng mail một.

- AI Agent có sử dụng MCP: Khi cần AI tóm tắt nội dung Email, AI tự truy cập vào mail, lấy mail, đọc và tóm tắt => tiết kiệm thời gian, tăng độ chính xác khi phân tích data, tối ưu khả năng từ "suy nghĩ" đến "hành động".

- [Model Context Protocol (MCP)-Image](https://base.vn/wp-content/uploads/2025/05/tai-sao-mcp-lai-quan-trong-1536x864.webp)

### Sử dụng MCP khi nào ?

- MCP phù hợp khi bạn cần một hệ thống linh hoạt, có khả năng kết nối đa công cụ và xử lý ngữ cảnh động. Đây là lựa chọn lý tưởng cho trợ lý AI, hệ thống phân tích dữ liệu hoặc các ứng dụng thông minh trong doanh nghiệp.

### Cơ chết hoạt động:

#### MCP hoạt động dựa trên mô hình 3 thành phần: Host, Client, Server

- MCP Host: là trung tâm điều phối, thường là chatbot hoặc ứng dụng AI như Claude. Host chịu trách nhiệm kiểm soát quyền truy cập và xác - thực kết nối.

- MCP Client: là ứng dụng trung gian, giúp truyền yêu cầu và phản hồi giữa AI và các server khác nhau.

- MCP Server: là nơi kết nối với các công cụ hoặc nguồn dữ liệu cụ thể như Slack, Google Drive hay cơ sở dữ liệu nội bộ. Mỗi server có thể cung cấp các khả năng riêng như đọc tệp, gửi tin nhắn hoặc truy vấn dữ liệu.

---

## 2. Knowledge Base (Vector)

- Là hệ thống lưu trữ và tìm kiếm thông tin dựa trên vector embeddings (biểu diễn vector).

- **Khái niệm cơ bản**: Thay vì lưu trữ dữ liệu dạng văn bản thuần túy và tìm kiếm theo từ khóa chính xác, vector knowledge base chuyển đổi thông tin thành các vector số trong không gian nhiều chiều. Mỗi đoạn văn bản, câu hỏi, hoặc tài liệu được biểu diễn thành một vector, và độ tương đồng giữa các thông tin được đo bằng khoảng cách giữa các vector này.

### Cách hoạt động:

- **Embedding**: Văn bản được chuyển đổi thành vector thông qua các mô hình AI (như BERT, OpenAI embeddings)

- **Lưu trữ**: Các vector được lưu trong vector database (như Pinecone, Weaviate, Milvus, Qdrant)

- **Tìm kiếm**: Khi có truy vấn, hệ thống chuyển câu hỏi thành vector và tìm các vector gần nhất (similarity search)

- [Vector Knowledge Base - Image](https://kb.pavietnam.vn/wp-content/uploads/2025/03/vector-database.png)

### Ưu điểm:

- **Tìm kiếm ngữ nghĩa**: Không chỉ khớp từ khóa, vector embedding học được mối quan hệ ngữ nghĩa, hiểu được ý nghĩa giữa các từ trong không gian vector. (Vua - hoàng hậu gần nhau hơn là chó-mèo-động vật)
- **Xử lý đa ngôn ngữ**: Vector có thể biểu diễn ý nghĩa xuyên ngôn ngữ, câu hỏi tiếng Anh vẫn tìm được tài liệu tiếng Việt vì chúng có ý nghĩa tương đương.
- **Linh hoạt**: Tìm được thông tin liên quan ngay cả khi cách diễn đạt khác nhau

**-> Vector knowledge base giúp hệ thống AI "hiểu" ngôn ngữ giống cách con người hơn - dựa trên ý nghĩa và ngữ cảnh thay vì chỉ khớp từ khóa máy móc. Đây là lý do tại sao các chatbot hiện đại có thể trả lời câu hỏi linh hoạt và chính xác hơn nhiều so với các hệ thống tìm kiếm truyền thống.**

### Ứng dụng

- Chatbot và trợ lý AI (RAG - Retrieval Augmented Generation)
- Hệ thống gợi ý sản phẩm
- Tìm kiếm tài liệu doanh nghiệp
- Phân tích và phân loại văn bản
