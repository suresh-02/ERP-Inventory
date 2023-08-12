import { HttpClient } from "@angular/common/http";
import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";

import { environment } from "src/environments/environment";
import { Goods, TransportBill } from "src/app/models";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-transport-bill-form",
  templateUrl: "./transport-bill-form.component.html",
  styleUrls: ["./transport-bill-form.component.scss"],
})
export class TransportBillFormComponent {
  form: FormGroup;

  _billId = -1;

  get billId() {
    return this._billId;
  }

  set billId(id: number) {
    this._billId = id;
    if (id > 0)
      this.http
        .get<TransportBill>(`${environment.apiUrl}/transport-bill/${id}`)
        .subscribe((data: TransportBill) => {
          this.form.patchValue(data);
          this.form.setControl("goods", this.setGoods(data.goods));
        });
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params: any) => {
      if (params.id) this.billId = Number(params.id);
    });
    this.form = fb.group({
      consigneeName: ["", [Validators.required]],
      rcNo: ["", [Validators.required]],
      gstin: ["", [Validators.required]],
      from: ["", [Validators.required]],
      to: ["", [Validators.required]],
      date: ["", [Validators.required]],
      purpose: ["", [Validators.required]],
      vehicleNo: ["", [Validators.required]],
      vehicleType: ["", [Validators.required]],
      remarks: [""],
      purchaseOrderNo: ["", [Validators.required]],
      exciseNo: ["", [Validators.required]],
      goods: fb.array([this.createGoodsForm()]),
    });
  }
  ngOnInit(): void {}

  get goodsForm() {
    return this.form.get("goods") as FormArray;
  }

  createGoodsForm(): FormGroup {
    return this.fb.group({
      id: null,
      description: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      totalAmount: ["", [Validators.required]],
    });
  }

  setGoods(goods: Goods[]): FormArray {
    const formArray: any = new FormArray([]);
    goods.forEach((d: Goods) => {
      formArray.push(
        this.fb.group({
          id: d.id,
          description: d.description,
          quantity: d.quantity,
          totalAmount: d.totalAmount,
        })
      );
    });
    return formArray;
  }

  submit() {
    if (this.form.valid) {
      if (this.billId === -1)
        this.http
          .post(`${environment.apiUrl}/transport-bill`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Transport Bill added successfully");
            this.form.reset();
            this.router.navigate(["/transport-bill"]);
          });
      else
        this.http
          .put(`${environment.apiUrl}/transport-bill/${this.billId}`, {
            id: this.billId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Transport Bill updated successfully");
            this.billId = -1;
            this.form.reset();
            this.router.navigate(["/transport-bill"]);
          });
    } else {
      Object.values(this.form.controls).forEach((control: any) => {
        if (control.controls?.length >= 1) {
          control.controls.forEach((fg: any) => {
            Object.values(fg.controls).forEach((control: any) => {
              if (control.invalid) {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
              }
            });
          });
        }
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
