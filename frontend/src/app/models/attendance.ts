import { Employee } from ".";

export interface Attendance {
  id: string;
  student: Employee;
  date: string;
}
