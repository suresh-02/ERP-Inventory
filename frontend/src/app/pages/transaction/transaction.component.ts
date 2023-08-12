import { differenceInCalendarDays } from "date-fns";
import { saveAs } from "file-saver";
import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "../../animations";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component } from "@angular/core";
import { Transaction } from "src/app/models";

import { environment } from "src/environments/environment";
import { formatDate } from "@angular/common";
@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
  animations: [FadeInOut],
})
export class TransactionComponent {
  user = JSON.parse(String(localStorage.getItem("user")));
  transactions: Transaction[];

  isLoading = false;

  total: number;
  pageSize = 10;
  pageIndex = 1;
  filter = [];

  transactionId = -1;

  _search = "";
  debounce: any;

  isDownload = false;
  dateRange = [];

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.getTransactions();
    }, 300);
  }

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {}

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;

  getTransactions(p?: any) {
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
    this.isLoading = !this.isLoading;
    this.http
      .get<{ data: Transaction[]; totalItems: number }>(
        `${environment.apiUrl}/transactions/page`,
        { params }
      )
      .subscribe(
        (res: { data: Transaction[]; totalItems: number }) => {
          this.isLoading = !this.isLoading;
          this.transactions = res.data;
          this.total = res.totalItems;
        },
        (err) => (this.isLoading = !this.isLoading)
      );
  }

  deleteTransaction(id: number) {
    this.http
      .delete(`${environment.apiUrl}/transactions/${id}`)
      .subscribe((data: any) => {
        this.message.success("Transaction deleted successfully");
        this.getTransactions();
      });
  }

  downloadTransaction() {
    let startDate = formatDate(this.dateRange[0], "yyyy-MM-dd", "en-US");
    let endDate = formatDate(this.dateRange[1], "yyyy-MM-dd", "en-US");
    this.http
      .get(
        `${environment.apiUrl}/reports/transaction?start=${startDate}&end=${endDate}`,
        {
          responseType: "blob" as "json",
        }
      )
      .subscribe(
        (blob: any) => {
          if (blob.message) this.message.warning(blob.message);
          else if (blob.type !== "application/json;charset=utf-8")
            saveAs(blob, `Transaction ${startDate}-${endDate}.xlsx`);
          else this.message.warning("Something went wrong");
          this.isDownload = false;
        },
        (err) => this.message.warning("Select different date range")
      );
  }
}
