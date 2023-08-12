import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import { TransportBill } from "src/app/models";
import { environment } from "src/environments/environment";
import html2pdf from "html2pdf.js";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent {
  billId: number;
  bill: TransportBill;

  @ViewChild("myDiv") myDiv: ElementRef;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {
    this.route.params.subscribe((params: any) => {
      this.billId = params["id"];
    });
    this.http
      .get<TransportBill>(`${environment.apiUrl}/transport-bill/${this.billId}`)
      .subscribe((data: TransportBill) => {
        this.bill = data;
      });
  }

  printDiv() {
    const printContents = this.myDiv.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();

    document.body.innerHTML = originalContents;
  }

  downloadAsPdf() {
    const options = {
      filename: `${this.bill.consigneeName}-${this.bill.purchaseOrderNo}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    const element = this.myDiv.nativeElement;
    element.classList.toggle("scale-75");
    element.classList.toggle("-mt-20");

    const id = this.message.loading("ID card is downloading...", {
      nzDuration: 0,
    }).messageId;
    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then((_: any) => {
        this.message.remove(id);
        element.classList.toggle("scale-75");
        element.classList.toggle("-mt-20");
      });
    // this.http
    //   .get(imgUrl + `?v=${new Date().getMilliseconds()}`, {
    //     responseType: "blob" as "json",
    //   })
    //   .subscribe((res: any) => {
    //     var reader = new FileReader();
    //     reader.readAsDataURL(res);
    //     reader.onloadend = () => {
    //       var base64data = reader.result;
    //       img.src = base64data;

    //     };
    //   });
  }
}
