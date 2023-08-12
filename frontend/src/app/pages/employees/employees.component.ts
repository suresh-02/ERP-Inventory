import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "../../animations";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { uploadCsv } from "src/app/helpers";
import { Mentor, Employee } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"],
  animations: [FadeInOut],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[];
  mentors: any[] = [{ text: "Not Assigned", value: null }];

  isLoading = false;

  total: number;
  pageSize = 10;
  pageIndex = 1;
  filter = [];

  employeeId = -1;

  section = new FormControl(null, [Validators.required]);
  year = new FormControl(null, [Validators.required]);

  _search = "";
  debounce: any;

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.getEmployees();
    }, 300);
  }

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {
    this.http
      .get<Mentor[]>(`${environment.apiUrl}/users`)
      .subscribe((users) => {
        users.map((u) => {
          this.mentors = [...this.mentors, { text: u.name, value: u.id }];
        });
      });
  }

  getEmployees(p?: any) {
    let params = new HttpParams()
      .append("page", `${this.pageIndex}`)
      .append("size", `${this.pageSize}`)
      .append("search", `${this.search}`);
    if (p) this.filter = p.filter;

    if (this.filter) {
      this.filter.forEach((filter: { value: any[]; key: string }) => {
        filter.value.forEach((value) => {
          params = params.append(filter.key, value);
        });
      });
    }
    this.isLoading = !this.isLoading;
    this.http
      .get<{ data: Employee[]; totalItems: number }>(
        `${environment.apiUrl}/employees/page`,
        { params }
      )
      .subscribe(
        (res: { data: Employee[]; totalItems: number }) => {
          this.isLoading = !this.isLoading;
          this.employees = res.data;
          this.total = res.totalItems;
        },
        (err) => (this.isLoading = !this.isLoading)
      );
  }

  deleteEmployee(id: number) {
    this.http
      .delete(`${environment.apiUrl}/employees/${id}`)
      .subscribe((data: any) => {
        this.message.success("Employees deleted successfully");
        this.getEmployees();
      });
  }

  handleUpload(file: any) {
    uploadCsv(file).subscribe((employees) => {
      employees.forEach((s: any) => {
        s["sectionId"] = this.section.value;
        s["yearId"] = this.year.value;
        file.value = null;
      });
      this.http
        .post(`${environment.apiUrl}/employees`, employees)
        .subscribe((data: any) => {
          this.message.success("Employees added successfully");
          this.getEmployees();
        });
    });
  }
}
