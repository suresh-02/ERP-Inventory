export interface Transaction {
  id: number;
  inventoryId: number;
  inventoryItem?: string;
  userName?: string;
  userId?: number;
  date: Date;
  inward: number;
  outward: number;
}
