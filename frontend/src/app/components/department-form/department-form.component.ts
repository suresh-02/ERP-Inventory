import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-department-form",
  templateUrl: "./department-form.component.html",
  styleUrls: ["./department-form.component.scss"],
})
export class DepartmentFormComponent {
  form: FormGroup;

  _departmentId = -1;

  get departmentId() {
    return this._departmentId;
  }

  @Input()
  set departmentId(id: number) {
    this._departmentId = id;
    this.departmentIdChange.emit(id);
    if (id > 0)
      this.http
        .get(`${environment.apiUrl}/departments/${id}`)
        .subscribe((data: any) => {
          this.form.patchValue(data);
        });
  }

  @Output()
  departmentIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      monthlySalary: ["", [Validators.required]],
      otSalary: ["", [Validators.required]],
      sundaySalary: ["", [Validators.required]],
      leaveDetection: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.valid) {
      if (this.departmentId === -1)
        this.http
          .post(`${environment.apiUrl}/departments`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Department added successfully");
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/departments/${this.departmentId}`, {
            id: this.departmentId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Department updated successfully");
            this.departmentId = -1;
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
