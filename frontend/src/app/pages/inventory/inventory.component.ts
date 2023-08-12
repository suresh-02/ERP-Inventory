import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "../../animations";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { uploadCsv } from "src/app/helpers";
import { Inventory } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
  animations: [FadeInOut],
})
export class InventoryComponent implements OnInit {
  editCache: { [key: string]: { edit: boolean; data: Inventory } } = {};
  inventory: Inventory[];

  isLoading = false;

  total: number;
  pageSize = 10;
  pageIndex = 1;

  inventoryId = -1;

  _search = "";
  debounce: any;

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.getInventory();
    }, 300);
  }

  form: FormGroup;

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder
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

  startEdit(id: number): void {
    this.editCache[id].edit = true;
    this.form.patchValue(this.editCache[id].data);
  }

  updateEditCache(): void {
    this.inventory.forEach((item, i) => {
      this.editCache[i] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  getInventory(p?: any) {
    let params = new HttpParams()
      .append("page", `${this.pageIndex}`)
      .append("size", `${this.pageSize}`)
      .append("search", `${this.search}`);
    let url = `${environment.apiUrl}/inventory/page?page=${this.pageIndex}&size=${this.pageSize}&search=${this.search}`;
    this.isLoading = !this.isLoading;
    this.http
      .get<{ data: Inventory[]; totalItems: number }>(
        `${environment.apiUrl}/inventory/page`,
        { params }
      )
      .subscribe(
        (res: { data: Inventory[]; totalItems: number }) => {
          this.isLoading = !this.isLoading;
          this.inventory = res.data;
          this.total = res.totalItems;
          this.updateEditCache();
        },
        (err) => (this.isLoading = !this.isLoading)
      );
  }

  deleteStudent(id: number) {
    this.http
      .delete(`${environment.apiUrl}/inventory/${id}`)
      .subscribe((data: any) => {
        this.message.success("Inventory deleted successfully");
        this.getInventory();
      });
  }
}
