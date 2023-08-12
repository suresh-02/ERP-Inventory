import { Router } from "express";
import { ReportController } from "../controllers";

export class ReportRoutes {
  private router: Router;
  private controller: ReportController;

  constructor() {
    this.controller = new ReportController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    //! Get Attendance Report
    this.router.get("/attendance", this.controller.getAttendanceReport);
    //! Get Transaction Report
    this.router.get("/transaction", this.controller.getTransactionReport);
  }

  public getRouter() {
    return this.router;
  }
}
