import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { Customer } from "src/app/models/customer";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  // customerId = -1;
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
      this.getCustomers();
    }, 300);
  }

  constructor(private http: HttpClient, private message: NzMessageService) {}
  ngOnInit(): void {}

  getCustomers(p?: any) {
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
      .get<{ data: Customer[]; totalItems: number }>(
        `${environment.apiUrl}/customers/page`,
        { params }
      )
      .subscribe({
        next: (res) => {
          this.customers = res.data;
          this.total = res.totalItems;
          this.isLoading = false;
        },
        error: (err) => (this.isLoading = false),
      });
  }
  deleteCustomer(id: number) {
    this.http
      .delete(`${environment.apiUrl}/customers/${id}`)
      .subscribe((data: any) => {
        this.message.success("Customer deleted successfully");
        this.getCustomers();
      });
  }
}
