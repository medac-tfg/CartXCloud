export interface GetProductQuery {
  barcode: string;
}

export interface AddScannedProductBody {
  productId: string;
  rfid: string;
}