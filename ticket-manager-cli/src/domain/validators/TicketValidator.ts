// Validators là nơi chứa các quy tắc nghiệp vụ cốt lõi dùng để đảm bảo tính hợp lệ, toàn vẹn dữ liệu

import { TicketPriority, TicketStatus } from "../entities/Ticket.js";

export class TicketValidator {
  static validateTitle(title: string) {
    if (!title || title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }
  }

  static validateStatus(status: TicketStatus) {
    if (!Object.values(TicketStatus).includes(status)) {
      throw new Error("Invalid status");
    }
  }

  static validatePriority(priority: TicketPriority) {
    if (!Object.values(TicketPriority).includes(priority)) {
      throw new Error("Invalid priority");
    }
  }

  static validateiSoluong(iSoLuong: number) {
    if (iSoLuong == null) {
      throw new Error("Số lượng là bắt buộc");
    }

    if (!Number.isInteger(iSoLuong)) {
      throw new Error("Số lượng phải là số nguyên");
    }

    if (iSoLuong < 1) {
      throw new Error("Số lượng phải ít nhất là 1");
    }
  }
}
