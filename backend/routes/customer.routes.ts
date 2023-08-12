import { Router } from "express";
import { CustomerController } from "../controllers";

export class CustomerRoutes {
  private router: Router;
  private controller: CustomerController;

  constructor() {
    this.controller = new CustomerController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    //! GetPaged
    this.router.get("/page", (req, res) => this.controller.getPaged(req, res));

    //! GetAll
    this.router.get("/", (req, res) => this.controller.getAll(req, res));

    //! GetById
    this.router.get("/:id", (req, res) => this.controller.getById(req, res));

    //! Post
    this.router.post("/", (req, res) => this.controller.upsert(req, res));

    //! Put
    this.router.put("/:id", (req, res) => this.controller.upsert(req, res));

    //! Delete
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));
  }

  public getRouter() {
    return this.router;
  }
}
