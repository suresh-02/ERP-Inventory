import { Component } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-gst-form",
  templateUrl: "./gst-form.component.html",
  styleUrls: ["./gst-form.component.scss"],
})
export class GstFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      gstIn: ["", [Validators.required]],
      state: ["", [Validators.required]],
      gstType: ["", [Validators.required]],
      panNo: ["", [Validators.required]],
    });
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.form.reset();
      this.form.value;
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
