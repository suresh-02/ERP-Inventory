import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "src/app/animations";
import { Address, Bank, Customer, Vendor } from "src/app/models";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-vendor-form",
  templateUrl: "./vendor-form.component.html",
  styleUrls: ["./vendor-form.component.scss"],
  animations: [FadeInOut],
})
export class VendorFormComponent implements OnInit {
  form: FormGroup;
  customers: Customer[] = [];
  _vendorId = -1;

  get vendorId() {
    return this._vendorId;
  }

  @Input()
  set vendorId(id: number) {
    this._vendorId = id;
    if (id > 0)
      this.http
        .get<Vendor>(`${environment.apiUrl}/vendors/${id}`)
        .subscribe((data: Vendor) => {
          this.form.patchValue(data);
          if (data.address)
            this.form.setControl("address", this.setAddress(data.address));
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
    this.http.get<Customer[]>(`${environment.apiUrl}/customers`).subscribe(
      (data: Customer[]) => {
        this.customers = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.form = this.fb.group({
      customerId: [""],
      contractor: ["", [Validators.required]],
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
      if (params.id > 0) this.vendorId = params.id;
    });
  }

  ngOnInit(): void {}

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

  resetForm() {
    this.form.reset();
    this.addressForm.removeAt(0);
    this.addressForm.removeAt(1);
  }

  submit() {
    if (this.form.valid) {
      if (this.vendorId === -1)
        this.http
          .post(`${environment.apiUrl}/vendors`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Vendor added successfully");
            this.resetForm();
          });
      else
        this.http
          .put(`${environment.apiUrl}/vendors/${this.vendorId}`, {
            id: this.vendorId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("vendors updated successfully");
            this.vendorId = -1;
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
