import { Request, Response } from "express";
import { DepartmentService } from "../services";
import { Department } from "../models";
import { getPagingData } from "../helpers";

export class DepartmentController {
  private departmentService: DepartmentService;

  constructor() {
    this.departmentService = new DepartmentService(Department);
  }

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.departmentService
      .getPaged(page, size)
      .then((departments) => res.status(200).json(getPagingData(departments)));
  }

  getAll(req: Request, res: Response) {
    this.departmentService
      .getAll()
      .then((departments) => res.status(200).json(departments));
  }

  getById(req: Request, res: Response) {
    this.departmentService.get(req.params.id).then((department) => {
      if (department) res.status(200).json(department);
      else
        res
          .status(404)
          .json({ message: `Department id:${req.params.id} does not exists` });
    });
  }

  post(req: Request, res: Response) {
    let { name, monthlySalary, otSalary, sundaySalary, leaveDetection } =
      req.body;
    let department = new Department({
      name,
      sundaySalary,
      monthlySalary,
      otSalary,
      leaveDetection,
    });
    this.departmentService
      .create(department)
      .then((department) => res.status(201).json(department))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let { id, name, monthlySalary, otSalary, sundaySalary, leaveDetection } =
      req.body;

    this.departmentService.get(req.params.id).then((department) => {
      if (department) {
        let updatedDepartment = new Department({
          ...department.dataValues,
          name,
          monthlySalary,
          otSalary,
          sundaySalary,
          leaveDetection,
        });

        this.departmentService
          .update(id, updatedDepartment)
          .then(() => res.status(200).json(updatedDepartment))
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Department id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.departmentService.get(req.params.id).then((department) => {
      if (department) {
        this.departmentService
          .delete(req.params.id)
          .then((department) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Department id:${req.params.id} does not exists` });
    });
  }
}
