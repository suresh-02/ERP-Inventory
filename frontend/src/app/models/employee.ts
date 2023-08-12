import { Department } from "./department";
export interface Employee {
  id: number;
  name: string;
  empId: string;
  department?: Department;
  mentorId?: number;
  mentorName?: number;
}
