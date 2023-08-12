import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Employee } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-mentor-form",
  templateUrl: "./mentor-form.component.html",
  styleUrls: ["./mentor-form.component.scss"],
})
export class MentorFormComponent implements OnInit {
  form: FormGroup;

  _mentorId = -1;

  get mentorId() {
    return this._mentorId;
  }

  @Input()
  set mentorId(id: number) {
    this._mentorId = id;
    this.mentorIdChange.emit(id);
    if (id > 0) {
      this.form.controls["password"].disable();

      this.http
        .get(`${environment.apiUrl}/users/${id}`)
        .subscribe((user: any) => {
          this.form.patchValue(user);
          this.employees = user.employees;
          let employeeId: any[] = [];
          user.employees.forEach((s: any) => {
            if (s.mentorId) employeeId.push(s.id);
          });
          this.form.controls["empId"].setValue(employeeId);
        });
    } else this.form.controls["password"].enable();
  }

  @Output()
  mentorIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.minLength(8),
        ],
      ],
      empId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.http
      .get<Employee[]>(`${environment.apiUrl}/employees/unassigned`)
      .subscribe((data: Employee[]) => {
        this.employees = data;
      });
  }

  submit() {
    if (this.form.valid) {
      if (this.mentorId === -1)
        this.http
          .post(`${environment.apiUrl}/users/register`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Mentor added successfully");
            this.getEmployees();
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/users/${this.mentorId}`, {
            id: this.mentorId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Mentor updated successfully");
            this.mentorId = -1;
            this.getEmployees();
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
