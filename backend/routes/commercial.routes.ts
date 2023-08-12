import { Router } from "express";
import { CommercialController } from "../controllers";

export class CommercialRoutes {
  private router: Router;
  private controller: CommercialController;

  constructor() {
    this.controller = new CommercialController();

    this.router = Router();
    this.routes();
  }

  private routes() {
    //getPaged
    this.router.get("/page", (req, res) => this.controller.getPaged(req, res));

    //getAll
    this.router.get("/", (req, res) => this.controller.getAll(req, res));

    //getbyID
    this.router.get("/:id", (req, res) => this.controller.getById(req, res));

    //register new commercial
    this.router.post("/", (req, res) => this.controller.post(req, res));

    //put
    this.router.put("/:id", (req, res) => this.controller.update(req, res));

    //delete
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));
  }

  public getRouter() {
    return this.router;
  }
}
