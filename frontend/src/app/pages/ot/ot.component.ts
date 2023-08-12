import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "../../animations";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component } from "@angular/core";
import { Ot } from "src/app/models";

import { environment } from "src/environments/environment";
import { NzTableQueryParams } from "ng-zorro-antd/table";
@Component({
  selector: "app-ot",
  templateUrl: "./ot.component.html",
  styleUrls: ["./ot.component.scss"],
  animations: [FadeInOut],
})
export class OtComponent {
  ot: Ot[];

  isLoading = false;

  total: number;
  pageSize = 10;
  pageIndex = 1;

  otId = -1;

  _search = "";
  debounce: any;

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.getOt();
    }, 300);
  }

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {}

  getOt(p?: NzTableQueryParams) {
    let currentSort: any = {};
    if (p) currentSort = p.sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder =
      (currentSort && currentSort.value === "ascend" ? "ASC" : "DESC") || null;
    let params = new HttpParams()
      .append("page", `${this.pageIndex}`)
      .append("size", `${this.pageSize}`)
      .append("search", `${this.search}`)
      .append("sortField", `${sortField}`)
      .append("sortOrder", `${sortOrder}`);
    if (p) {
      p.filter.forEach((filter: { value: any[]; key: string }) => {
        filter.value.forEach((value) => {
          params = params.append(filter.key, value);
        });
      });
    }
    this.isLoading = !this.isLoading;
    this.http
      .get<{ data: Ot[]; totalItems: number }>(
        `${environment.apiUrl}/ot/page`,
        { params }
      )
      .subscribe(
        (res: { data: Ot[]; totalItems: number }) => {
          this.isLoading = !this.isLoading;
          this.ot = res.data;
          this.total = res.totalItems;
        },
        (err) => (this.isLoading = !this.isLoading)
      );
  }

  deleteOt(id: number) {
    this.http
      .delete(`${environment.apiUrl}/ot/${id}`)
      .subscribe((data: any) => {
        this.message.success("Ot deleted successfully");
        this.getOt();
      });
  }
}
