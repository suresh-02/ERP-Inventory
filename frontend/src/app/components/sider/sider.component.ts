import { NzMessageService } from "ng-zorro-antd/message";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Validators } from "@angular/forms";
import { FormControl } from "@angular/forms";
import { SlideInOut } from "./../../animations";
import { Component, Input, OnInit } from "@angular/core";

import { environment } from "src/environments/environment";

import { saveAs } from "file-saver";

@Component({
  selector: "app-sider",
  templateUrl: "./sider.component.html",
  styleUrls: ["./sider.component.scss"],
  animations: [SlideInOut],
})
export class SiderComponent implements OnInit {
  @Input()
  menu: any[] = [];

  isVisible = false;
  isEmail = false;

  dropdown: { id: any; isOpen: boolean } = {
    id: null,
    isOpen: false,
  };

  section = new FormControl<any>(null, [Validators.required]);
  year = new FormControl<any>(null, [Validators.required]);
  date = new FormControl<any>(null, [Validators.required]);

  openMap: any = {
    sub1: true,
    sub2: false,
    sub3: false,
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {}

  toggle(id: any) {
    if (id === this.dropdown.id) this.dropdown.isOpen = !this.dropdown.isOpen;
    else this.dropdown.isOpen = true;
    this.dropdown.id = id;
  }

  changeReportType(type: string) {
    if (type === "day") this.date.enable();
    else this.date.disable();
  }

  getReport() {
    const yearName = ["I", "II", "III", "IV"];
    const secName = ["A", "B", "C", "D", "E", "F"];

    let fDate: any;
    if (this.date.value)
      fDate = formatDate(String(this.date.value), "yyyy-MM-dd", "en");

    let fileName = this.date.value
      ? `${fDate}-${yearName[this.year.value - 1]}-${
          this.section.value ? secName[this.section.value - 1] : ""
        }.xlsx`
      : `${yearName[this.year.value]}-${
          this.section.value ? secName[this.section.value - 1] : ""
        }Full.xlsx`;

    this.http
      .get<any>(
        `${environment.apiUrl}/report/day?isEmail=${this.isEmail}&year=${
          this.year.value
        }&sec=${this.section.value}${fDate ? `&date=${fDate}` : ""}`,
        {
          responseType: "blob" as "json",
        }
      )
      .subscribe((blob) => {
        if (blob.message) this.message.warning(blob.message);
        else if (blob.type !== "application/json;charset=utf-8")
          saveAs(blob, fileName);

        this.section.reset();
        this.year.reset();
        this.date.reset();
      });
  }
}
