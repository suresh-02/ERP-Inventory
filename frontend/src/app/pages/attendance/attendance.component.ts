import { NzMessageService } from "ng-zorro-antd/message";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { FadeInOut } from "../../animations";
import { Component, OnInit } from "@angular/core";
import { saveAs } from "file-saver";
import { formatDate } from "@angular/common";

import { differenceInCalendarDays } from "date-fns";

@Component({
  selector: "app-attendance",
  templateUrl: "./attendance.component.html",
  styleUrls: ["./attendance.component.scss"],
  animations: [FadeInOut],
})
export class AttendanceComponent implements OnInit {
  absentees: any;
  isDownload = false;
  dateRange = [];

  constructor(private http: HttpClient, private message: NzMessageService) {}
  ngOnInit(): void {}

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, new Date()) > 0;

  downloadAttendance() {
    let startDate = formatDate(this.dateRange[0], "yyyy-MM-dd", "en-US");
    let endDate = formatDate(this.dateRange[1], "yyyy-MM-dd", "en-US");
    this.http
      .get(
        `${environment.apiUrl}/reports/attendance?start=${startDate}&end=${endDate}`,
        {
          responseType: "blob" as "json",
        }
      )
      .subscribe((blob: any) => {
        if (blob.message) this.message.warning(blob.message);
        else if (blob.type !== "application/json;charset=utf-8")
          saveAs(blob, `Attendance ${startDate}-${endDate}.xlsx`);
        else this.message.error("Something went wrong");
        this.isDownload = false;
      });
  }
}
