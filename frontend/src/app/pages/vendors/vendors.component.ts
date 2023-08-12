import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { Vendor } from "src/app/models";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-vendors",
  templateUrl: "./vendors.component.html",
  styleUrls: ["./vendors.component.scss"],
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  vendorId = -1;
  isLoading = false;
  total: number;
  pageSize = 10;
  pageIndex = 1;
  filter = [];

  _search = "";
  debounce: any;

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.getVendors();
    }, 300);
  }

  constructor(private http: HttpClient, private message: NzMessageService) {}
  ngOnInit(): void {}

  getVendors(p?: any) {
    this.isLoading = true;
    let params = new HttpParams()
      .append("page", `${this.pageIndex}`)
      .append("size", `${this.pageSize}`)
      .append("search", `${this.search}`);
    if (p) this.filter = p.filter;

    if (this.filter) {
      this.filter.forEach((filter: { value: any[]; key: string }) => {
        filter.value.forEach((value) => {
          params = params.append(filter.key, value);
        });
      });
    }
    this.http
      .get<{ data: Vendor[]; totalItems: number }>(
        `${environment.apiUrl}/vendors/page`,
        { params }
      )
      .subscribe({
        next: (res) => {
          this.vendors = res.data;
          this.total = res.totalItems;
          this.isLoading = false;
        },
        error: (err) => (this.isLoading = false),
      });
  }
  deleteVendor(id: number) {
    this.http
      .delete(`${environment.apiUrl}/vendors/${id}`)
      .subscribe((data: any) => {
        this.message.success("Vendor deleted successfully");
        this.getVendors();
      });
  }
}
