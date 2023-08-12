import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { environment } from "src/environments/environment";
import { Department, Mentor } from "src/app/models";

@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.component.html",
  styleUrls: ["./employee-form.component.scss"],
})
export class EmployeeFormComponent implements OnInit {
  mentors: Mentor[];
  departments: Department[];
  form: FormGroup;

  _employeeId = -1;

  get employeeId() {
    return this._employeeId;
  }

  @Input()
  set employeeId(id: number) {
    this._employeeId = id;
    this.employeeIdChange.emit(id);
    if (id > 0)
      this.http
        .get(`${environment.apiUrl}/employees/${id}`)
        .subscribe((data: any) => {
          this.form.patchValue(data);
        });
  }

  @Output()
  employeeIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      empId: ["", [Validators.required]],
      deptId: ["", [Validators.required]],
      mentorId: "",
    });
  }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/users`).subscribe((data: any) => {
      this.mentors = data;
    });
    this.http
      .get(`${environment.apiUrl}/departments`)
      .subscribe((data: any) => {
        this.departments = data;
      });
  }

  submit() {
    if (this.form.valid) {
      if (this.employeeId === -1)
        this.http
          .post(`${environment.apiUrl}/employees`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Employees added successfully");
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/employees/${this.employeeId}`, {
            id: this.employeeId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Employees updated successfully");
            this.employeeId = -1;
            this.form.reset();
            this.onFormSubmit.emit();
          });
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
