import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { environment } from "src/environments/environment";
import { Inventory } from "src/app/models";

@Component({
  selector: "app-inventory-form",
  templateUrl: "./inventory-form.component.html",
  styleUrls: ["./inventory-form.component.scss"],
})
export class InventoryFormComponent implements OnInit {
  form: FormGroup;

  _studentId = -1;

  get studentId() {
    return this._studentId;
  }

  @Input()
  set studentId(id: number) {
    this._studentId = id;
    this.studentIdChange.emit(id);
    if (id > 0)
      this.http
        .get(`${environment.apiUrl}/inventory/${id}`)
        .subscribe((data: any) => {
          this.form.patchValue(data);
        });
  }

  @Output()
  studentIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      material: ["", [Validators.required]],
      stock: ["", [Validators.required]],
      usage: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      balance: "",
    });
    this.form.get("stock")?.valueChanges.subscribe((value) => {
      this.form.get("balance")?.setValue(value - this.form.get("usage")?.value);
    });
    this.form.get("usage")?.valueChanges.subscribe((value) => {
      this.form.get("balance")?.setValue(this.form.get("stock")?.value - value);
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.valid) {
      if (this.studentId === -1)
        this.http
          .post(`${environment.apiUrl}/inventory`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Inventory added successfully");
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/inventory/${this.studentId}`, {
            id: this.studentId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Inventory updated successfully");
            this.studentId = -1;
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
