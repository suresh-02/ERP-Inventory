import { FadeInOut } from "../../animations";
import { DataService } from "src/app/helpers/data.service";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { TransferItem } from "ng-zorro-antd/transfer";
import { Employee } from "src/app/models";
import { environment } from "src/environments/environment";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "attendance-form",
  templateUrl: "./attendance-form.component.html",
  styleUrls: ["./attendance-form.component.scss"],
  animations: [FadeInOut],
})
export class AttendanceFormComponent implements OnInit {
  list: Array<TransferItem & { empId: string; name: string }> = [];

  user = JSON.parse(String(localStorage.getItem("user")));

  selectedDate: Date = new Date();

  employees: Employee[];
  absentees: any[] = [];

  constructor(
    private http: HttpClient,
    private data: DataService,
    private message: NzMessageService
  ) {
    this.data.getDate().subscribe((date) => {
      this.selectedDate = date;
      this.getEmployees();
    });
  }

  ngOnInit(): void {}

  getEmployees() {
    let Fdate = formatDate(this.selectedDate, "yyyy-MM-dd", "en");
    this.http
      .get<any>(
        `${environment.apiUrl}/employees/day-present?mentor=${this.user.id}&date=${Fdate}`
      )
      .subscribe((data: { preEmployees: Employee[]; absEmployees: any[] }) => {
        this.employees = data.preEmployees;
        this.absentees = data.absEmployees;
        this.getData(data);
      });
  }

  getData(data: any): void {
    this.list = [];
    let { preEmployees, absEmployees } = data;
    preEmployees.forEach((s: any) => {
      this.list.push({
        key: s.id,
        title: s.empId + " - " + s.name.toLowerCase(),
        direction: "left",
        empId: s.empId,
        name: s.name,
      });
    });
    absEmployees.forEach((s: any) => {
      this.list.push({
        key: s.id,
        title: s.employeeEmpId + "-" + s.employeeName.toLowerCase(),
        direction: "right",
        empId: s.employeeEmpId,
        name: s.employeeName,
      });
    });
  }

  change(ret: any): void {
    if (ret.from === "left" && ret.to === "right") {
      let Fdate = formatDate(this.selectedDate, "yyyy-MM-dd", "en");
      let employeeId: any = [];
      ret.list.forEach((employee: any) => {
        employeeId.push(employee.key);
      });
      let data = {
        date: Fdate,
        employeeId,
      };
      this.http
        .post(`${environment.apiUrl}/attendances`, data)
        .subscribe((data) => {
          this.message.success("Attendance added successfully");
          this.getEmployees();
        });
    } else if (ret.from === "right" && ret.to === "left") {
      let id: any = [];
      ret.list.forEach((att: any) => {
        id.push(att.key);
      });
      this.http
        .delete(`${environment.apiUrl}/attendances?id=${id}`)
        .subscribe((data) => {
          this.message.success("Attendance deleted successfully");
          this.getEmployees();
        });
    }
  }
}
