import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { EmployeesComponent } from "./pages/employees/employees.component";
import { AttendanceComponent } from "./pages/attendance/attendance.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseLayoutComponent } from "./pages/base-layout/base-layout.component";
import { MentorComponent } from "./pages/mentor/mentor.component";
import { InventoryComponent } from "./pages/inventory/inventory.component";
import { AdminGuard, AuthGuard } from "./helpers/auth.guard";
import { DepartmentComponent } from "./pages/department/department.component";
import { TransactionComponent } from "./pages/transaction/transaction.component";
import { InvoiceComponent } from "./components/invoice/invoice.component";
import { OtComponent } from "./pages/ot/ot.component";
import { TransportBillComponent } from "./pages/transport-bill/transport-bill.component";
import { TransportBillEditComponent } from "./pages/transport-bill-edit/transport-bill-edit.component";
import { SpecialInstructionsComponent } from "./pages/special-instructions/special-instructions.component";
import { CustomersComponent } from "./pages/customers/customers.component";
import { VendorsComponent } from "./pages/vendors/vendors.component";

import { CustomerFormComponent } from "./components/customer-form/customer-form.component";
import { VendorFormComponent } from "./components/vendor-form/vendor-form.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "attendance",
        component: AttendanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ot",
        component: OtComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "employees",
        component: EmployeesComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "mentor",
        component: MentorComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "home",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "inventory",
        component: InventoryComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "department",
        component: DepartmentComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "transaction",
        component: TransactionComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "bill-layout/:id",
        component: InvoiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "transport-bill",
        component: TransportBillComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "transport-bill-edit/:id",
        component: TransportBillEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "special-instruction",
        component: SpecialInstructionsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "customer",
        canActivate: [AuthGuard],
        children: [
          {
            path: "",
            component: CustomersComponent,
          },
          {
            path: "edit/:id",
            component: CustomerFormComponent,
          },
        ],
      },
      {
        path: "vendor",
        children: [
          {
            path: "",
            component: VendorsComponent,
          },
          {
            path: "edit/:id",
            component: VendorFormComponent,
          },
        ],
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: "",
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      scrollOffset: [0, 0],
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
