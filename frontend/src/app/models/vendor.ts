import { Address, Bank } from "./customer";

export interface Vendor {
  id: number;
  customerId: number;
  name: string;
  shortName: string;
  type: string;
  status: string;
  phoneNo?: string;
  salesPerson: string;
  consignee: string;
  territory: string;
  website?: string;
  address?: Address[];
  bank?: Bank[];
}
