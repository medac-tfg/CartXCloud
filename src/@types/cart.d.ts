export interface AddProductBody {
  ticketId: string;
  rfid: string;
}

export interface ChangeAdditionalItemQuantityBody {
  itemId: string;
  ticketId: string;
  quantity: number;
}