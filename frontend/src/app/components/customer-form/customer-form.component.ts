import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "src/app/animations";
import { Address, Bank, Customer } from "src/app/models";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-customer-form",
  templateUrl: "./customer-form.component.html",
  styleUrls: ["./customer-form.component.scss"],
  animations: [FadeInOut],
})
export class CustomerFormComponent implements OnInit {
  form: FormGroup;
  _customerId = -1;

  get customerId() {
    return this._customerId;
  }

  @Input()
  set customerId(id: number) {
    this._customerId = id;
    if (id > 0)
      this.http
        .get<Customer>(`${environment.apiUrl}/customers/${id}`)
        .subscribe((data: Customer) => {
          this.form.patchValue(data);
          if (data.address)
            this.form.setControl("address", this.setAddress(data.address));
          if (data.commercial) {
            this.addCommercialDetails();
            this.form.patchValue({ commercial: data.commercial });
            console.log(this.form.controls["commercial"].value);
          }
          if (data.bank) {
            this.form.setControl("bank", this.setBank(data.bank));
          }
        });
  }

  territories = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      code: ["", [Validators.required]],
      name: ["", [Validators.required]],
      shortName: ["", [Validators.required]],
      type: ["", [Validators.required]],
      salesPerson: ["", [Validators.required]],
      consignee: ["", [Validators.required]],
      territory: ["", [Validators.required]],
      phoneNo: "",
      website: "",
      address: fb.array([]),
      bank: fb.array([]),
    });
    route.params.subscribe((params: any) => {
      if (params.id > 0) this.customerId = params.id;
    });
  }

  ngOnInit(): void {}

  addCommercialDetails() {
    this.form.addControl(
      "commercial",
      this.fb.group({
        id: null,
        mode: [null, [Validators.required]],
        terms: [null, [Validators.required]],
        basics: [null, [Validators.required]],
        currency: [null, [Validators.required]],
        billSequence: [null, [Validators.required]],
        saleTarget: [null, [Validators.required]],
        notes: [null, [Validators.required]],
      })
    );
  }

  get bankForm() {
    return this.form.get("bank") as FormArray;
  }

  createBankForm(): FormGroup {
    return this.fb.group({
      id: null,
      name: ["", [Validators.required]],
      accNo: ["", [Validators.required]],
      branch: ["", [Validators.required]],
      ifsc: ["", [Validators.required]],
    });
  }

  setBank(bank: Bank[]): FormArray {
    const formArray: any = new FormArray([]);
    bank.forEach((a: Bank) => {
      formArray.push(
        this.fb.group({
          id: a.id,
          name: a.name,
          accNo: a.accNo,
          branch: a.branch,
          ifsc: a.ifsc,
        })
      );
    });
    return formArray;
  }

  get addressForm() {
    return this.form.get("address") as FormArray;
  }

  createAddressForm(): FormGroup {
    return this.fb.group({
      id: null,
      line1: ["", [Validators.required]],
      line2: ["", [Validators.required]],
      line3: "",
      city: ["", [Validators.required]],
    });
  }

  setAddress(address: Address[]): FormArray {
    const formArray: any = new FormArray([]);
    address.forEach((a: Address) => {
      formArray.push(
        this.fb.group({
          id: a.id,
          line1: a.line1,
          line2: a.line2,
          line3: a.line3,
          city: a.city,
        })
      );
    });
    return formArray;
  }

  resetForm() {
    this.form.reset();
    this.addressForm.removeAt(0);
    this.addressForm.removeAt(1);
  }

  submit() {
    if (this.form.valid) {
      if (this.customerId === -1)
        this.http
          .post(`${environment.apiUrl}/customers`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Customer added successfully");
            this.resetForm();
          });
      else
        this.http
          .put(`${environment.apiUrl}/customers/${this.customerId}`, {
            id: this.customerId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Customer updated successfully");
            this.customerId = -1;
            this.resetForm();
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
