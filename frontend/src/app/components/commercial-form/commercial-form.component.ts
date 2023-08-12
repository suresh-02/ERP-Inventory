import { Component } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-commercial-form",
  templateUrl: "./commercial-form.component.html",
  styleUrls: ["./commercial-form.component.scss"],
})
export class CommercialFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      dispatch: [null, [Validators.required]],
      terms: [null, [Validators.required]],
      basics: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      sequence: [null, [Validators.required]],
      target: [null, [Validators.required]],
      notes: [null, [Validators.required]],
      bankName1: [null, [Validators.required]],
      accNo: [null, [Validators.required]],
      branchName: [null, Validators.required],
      ifsc: [null, [Validators.required]],
      bankName2: [null, [Validators.required]],
    });
  }
}
