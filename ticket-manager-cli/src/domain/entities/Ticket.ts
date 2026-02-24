// entities là nơi định nghĩa đối tượng(object) và các trạng thái (state), hành vi (behavior) quan trọng nhất của ứng dụng

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export class Ticket {
  constructor(
    public readonly id: number,
    public title: string,
    public description: string,
    public status: TicketStatus,
    public priority: TicketPriority,
    public tags: string[],
    public iSoLuong: number,
    public readonly createdAt: Date,
  ) {}
}
