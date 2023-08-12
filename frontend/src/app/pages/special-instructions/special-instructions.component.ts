import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NzUploadFile } from "ng-zorro-antd/upload";
import { environment } from "src/environments/environment";
import { FadeOut, StaggerAnimation } from "src/app/animations";

@Component({
  selector: "app-special-instructions",
  templateUrl: "./special-instructions.component.html",
  styleUrls: ["./special-instructions.component.scss"],
  animations: [StaggerAnimation, FadeOut],
})
export class SpecialInstructionsComponent implements OnInit {
  user = JSON.parse(String(localStorage.getItem("user")));

  constructor(private http: HttpClient) {}

  uploadUrl = `${environment.apiUrl}/files/upload`;
  isUpload = false;
  fileList: NzUploadFile[] = [];
  files: any[] = [];

  fileUrl = (fileName: string) => "http://localhost:3000/" + fileName;

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/files`).subscribe({
      next: (data: any) => {
        this.files = [...this.files, ...data];
      },
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  getFiles() {
    this.http.get<any[]>(`${environment.apiUrl}/files`).subscribe({
      next: (data: any[]) => {
        this.files = [...data.filter((d) => !this.files.includes(d))];
      },
    });
  }

  uploadPdf(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append("file", file);
    });

    this.http.post(`${this.uploadUrl}`, formData).subscribe((event: any) => {
      let newFiles = this.fileList.map((file) => {
        console.log(file);
        return {
          fileName: file.name,
          userId: this.user.id,
        };
      });
      this.files = [...this.files, ...newFiles];
      this.isUpload = false;
      this.fileList = [];
    });
  }

  deletePdf(id: number) {
    this.http
      .delete(
        `${environment.apiUrl}/files/${this.files[id].id}?fileName=${this.files[id].fileName}`
      )
      .subscribe({
        next: (data: any) => {
          this.files.splice(id, 1);
        },
      });
  }
}
