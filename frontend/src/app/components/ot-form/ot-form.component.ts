import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Employee } from "src/app/models";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-ot-form",
  templateUrl: "./ot-form.component.html",
  styleUrls: ["./ot-form.component.scss"],
})
export class OtFormComponent {
  employees: Employee[];
  form: FormGroup;

  _otId = -1;

  get otId() {
    return this._otId;
  }

  @Input()
  set otId(id: number) {
    this._otId = id;
    this.otIdChange.emit(id);
    if (id > 0)
      this.http.get(`${environment.apiUrl}/ot/${id}`).subscribe((data: any) => {
        this.form.patchValue(data);
        if (data.isSunday)
          this.form.controls["isOtOrSunday"].setValue("sunday");
        else this.form.controls["isOtOrSunday"].setValue("ot");
      });
  }

  @Output()
  otIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      date: [new Date(), [Validators.required]],
      employeeId: ["", [Validators.required]],
      hours: ["", [Validators.required]],
      isOtOrSunday: ["ot", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/employees`).subscribe((data: any) => {
      this.employees = data;
    });
  }

  submit() {
    if (this.form.valid) {
      let data = this.form.value;
      if (data.isOtOrSunday === "ot") {
        data.isOt = true;
        data.isSunday = false;
      } else {
        data.isOt = false;
        data.isSunday = true;
      }
      if (this.otId === -1)
        this.http
          .post(`${environment.apiUrl}/ot`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Ot added successfully");
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/ot/${this.otId}`, {
            id: this.otId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Ot updated successfully");
            this.otId = -1;
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
