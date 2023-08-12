import { Router } from "express";
import { EmployeeController } from "../controllers";

export class EmployeeRoutes {
  private router: Router;
  private controller: EmployeeController;

  constructor() {
    this.controller = new EmployeeController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    //! GetPaged
    this.router.get("/page", (req, res) => this.controller.getPaged(req, res));

    //! GetAll
    this.router.get("/", (req, res) => this.controller.getAll(req, res));

    this.router.get("/day-present", (req, res) =>
      this.controller.getDayPresent(req, res)
    );

    //! GetUnassigned
    this.router.get("/unassigned", (req, res) =>
      this.controller.getUnassigned(req, res)
    );

    //! GetById
    this.router.get("/:id", (req, res) => this.controller.getById(req, res));

    //! Post
    this.router.post("/", (req, res) => this.controller.post(req, res));

    //! Put
    this.router.put("/:id", (req, res) => this.controller.update(req, res));

    //! Delete
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));
  }

  public getRouter() {
    return this.router;
  }
}
