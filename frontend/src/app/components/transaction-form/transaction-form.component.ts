import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd/message";
import { Inventory } from "src/app/models";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-transaction-form",
  templateUrl: "./transaction-form.component.html",
  styleUrls: ["./transaction-form.component.scss"],
})
export class TransactionFormComponent {
  user = JSON.parse(String(localStorage.getItem("user")));
  inventory: Inventory[];
  selectedItem: Inventory;
  form: FormGroup;

  _transactionId = -1;

  get transactionId() {
    return this._transactionId;
  }

  @Input()
  set transactionId(id: number) {
    this._transactionId = id;
    this.transactionIdChange.emit(id);
    if (id > 0)
      this.http
        .get(`${environment.apiUrl}/transactions/${id}`)
        .subscribe((data: any) => {
          this.form.patchValue(data);
        });
  }

  @Output()
  transactionIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      inventoryId: ["", [Validators.required]],
      date: new Date(),
      isInwardOrOutward: ["outWard", [Validators.required]],
      quantity: ["", [Validators.required]],
    });
    this.form.controls["inventoryId"].valueChanges.subscribe((value) => {
      this.selectedItem = this.inventory.filter((i) => i.id === value)[0];
      this.form.controls["quantity"].reset();
    });
  }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/inventory`).subscribe((data: any) => {
      this.inventory = data;
    });
  }

  submit() {
    if (this.form.valid) {
      let data = this.form.value;
      if (data.isInwardOrOutward === "inWard") data.inward = data.quantity;
      else data.outward = data.quantity;
      data.userId = this.user.id;
      if (this.transactionId === -1)
        this.http
          .post(`${environment.apiUrl}/transactions`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Transaction added successfully");
            this.form.controls["quantity"].reset();
            this.form.controls["inventoryId"].reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/transactions/${this.transactionId}`, {
            id: this.transactionId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Transaction updated successfully");
            this.transactionId = -1;
            this.form.controls["quantity"].reset();
            this.form.controls["inventoryId"].reset();
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
