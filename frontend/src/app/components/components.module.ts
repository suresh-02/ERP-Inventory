import { NgZorroModule } from "./../NgZorro.module";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SiderComponent } from "./sider/sider.component";
import { CalendarComponent } from "./calendar/calendar.component";
// import { ChartComponent } from "./chart/chart.component";
import { EmployeeFormComponent } from "./employee-form/employee-form.component";
import { MentorFormComponent } from "./mentor-form/mentor-form.component";
import { AttendanceFormComponent } from "./attendance-form/attendance-form.component";
import { InventoryFormComponent } from "./inventory-form/inventory-form.component";
import { DepartmentFormComponent } from "./department-form/department-form.component";
import { TransactionFormComponent } from "./transaction-form/transaction-form.component";
import { InvoiceComponent } from "./invoice/invoice.component";
import { OtFormComponent } from "./ot-form/ot-form.component";
import { TransportBillFormComponent } from "./transport-bill-form/transport-bill-form.component";
import { CommercialFormComponent } from "./commercial-form/commercial-form.component";
import { CustomerFormComponent } from "./customer-form/customer-form.component";
import { GstFormComponent } from "./gst-form/gst-form.component";
import { VendorFormComponent } from "./vendor-form/vendor-form.component";

@NgModule({
  declarations: [
    SiderComponent,
    CalendarComponent,
    // ChartComponent,
    EmployeeFormComponent,
    MentorFormComponent,
    AttendanceFormComponent,
    InventoryFormComponent,
    DepartmentFormComponent,
    TransactionFormComponent,
    InvoiceComponent,
    OtFormComponent,
    TransportBillFormComponent,
    CommercialFormComponent,
    CustomerFormComponent,
    GstFormComponent,
    VendorFormComponent,
  ],
  exports: [
    SiderComponent,
    CalendarComponent,
    // ChartComponent,
    EmployeeFormComponent,
    MentorFormComponent,
    AttendanceFormComponent,
    InventoryFormComponent,
    DepartmentFormComponent,
    TransactionFormComponent,
    InvoiceComponent,
    OtFormComponent,
    InventoryFormComponent,
    TransportBillFormComponent,
    CommercialFormComponent,
    CustomerFormComponent,
    GstFormComponent,
    VendorFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroModule,
  ],
})
export class ComponentsModule {}
