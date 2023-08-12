export interface TransportBill {
  id: number;
  consigneeName: string;
  rcNo: string;
  gstin: string;
  date: Date;
  purpose: string;
  vehicleType: string;
  vehicleNo: string;
  from: string;
  to: string;
  purchaseOrderNo: string;
  exciseNo: string;
  remarks: string;
  goods: Goods[];
}
export interface Goods {
  id: number;
  description: string;
  quantity: number;
  totalAmount: number;
}
