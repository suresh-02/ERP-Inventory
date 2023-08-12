export interface Customer {
  id: number;
  code: string;
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
  commercial?: Commercial;
  bank?: Bank[];
}

export interface Address {
  id: number;
  customerId: number;
  line1: string;
  line2: string;
  line3?: string;
  city: string;
}

export interface Commercial {
  id: number;
  mode: string;
  terms: string;
  basics: number;
  currency: number;
  billSequence: number;
  saleTarget: number;
  notes: string;
}

export interface Bank {
  id: number;
  customerId?: number;
  name: string;
  accNo: string;
  branch: string;
  ifsc: string;
}
