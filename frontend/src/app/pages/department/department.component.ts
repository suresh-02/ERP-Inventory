import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "src/app/animations";
import { Department, Mentor } from "src/app/models";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.scss"],
  animations: [FadeInOut],
})
export class DepartmentComponent {
  departments: Department[];
  departmentId = -1;
  isLoading = false;

  pageSize = 10;
  pageIndex = 1;
  total: number;

  constructor(private http: HttpClient, private message: NzMessageService) {}
  ngOnInit(): void {
    this.getDepartments();
  }

  getDepartments() {
    this.isLoading = !this.isLoading;
    this.http.get<Department[]>(`${environment.apiUrl}/departments`).subscribe(
      (res: Department[]) => {
        this.departments = res;
        this.isLoading = !this.isLoading;
        this.total = res.length;
      },
      (err) => (this.isLoading = !this.isLoading)
    );
  }

  deleteDepartment(id: number) {
    this.http
      .delete(`${environment.apiUrl}/departments/${id}`)
      .subscribe((data: any) => {
        this.message.success("Mentor deleted successfully");
        this.getDepartments();
      });
  }
}
