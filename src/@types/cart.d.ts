export interface StartOrderBody {
  shoppingMethod: string;
}

export interface BaseParams {
  ticketId: string;
}

export interface AddProductsBody {
  ticketId: string;
  tags: string[];
}

export interface AddSingleProductBody {
  ticketId: string;
  rfid: string;
}

export interface ChangeAdditionalItemQuantityBody {
  itemId: string;
  ticketId: string;
  quantity: number;
}

export interface CheckAdminPinBody {
  adminPin: string;
}
