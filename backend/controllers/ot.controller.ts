import { Request, Response } from "express";
import { OtService } from "../services";
import { Ot, Employee } from "../models";
import { getPagingData } from "../helpers";
import { Op, Sequelize } from "sequelize";

export class OtController {
  private otService: OtService;

  constructor() {
    this.otService = new OtService(Ot);
  }

  private options = {
    attributes: [
      "id",
      "date",
      "employeeId",
      [Sequelize.col("employee.name"), "employeeName"],
      "hours",
      "isOt",
      "isSunday",
    ],
    include: [
      {
        model: Employee,
        as: "employee",
      },
    ],
    order: [["employeeName", "ASC"]],
  };

  getPaged(req: Request, res: Response) {
    const { page, size, search, sortField, sortOrder, fType } = req.query;
    let where = {};

    //! Search whith name
    if (search)
      where = {
        ...where,
        [Op.or]: [
          {
            "$employee.name$": {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      };

    // ! Filter by type
    if (fType === "ot") where = { ...where, isOt: true, isSunday: false };
    if (fType === "sunday") where = { ...where, isOt: false, isSunday: true };

    let fOptions: any = { ...this.options, where };

    // ! Sort by employee name
    if (sortField !== "null")
      fOptions = {
        ...fOptions,
        order: [[sortField, sortOrder]],
      };

    this.otService.getPaged(page, size, fOptions).then((ot) => {
      res.status(200).json(getPagingData(ot));
    });
  }

  getAll(req: Request, res: Response) {
    this.otService.getAll(this.options).then((ot) => {
      res.status(200).json(ot);
    });
  }

  getById(req: Request, res: Response) {
    this.otService.get(req.params.id, this.options).then((ot) => {
      if (ot) res.status(200).json(ot);
      else
        res.status(404).json({
          message: `OT id:${req.params.id} does not exists`,
        });
    });
  }

  post(req: Request, res: Response) {
    let { date, employeeId, hours, isOt, isSunday } = req.body;
    let ot = new Ot({ date, employeeId, hours, isOt, isSunday });
    this.otService
      .create(ot)
      .then((ot) => res.status(201).json(ot))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.otService.get(req.params.id).then((ot) => {
      if (ot) {
        let updatedOt = new Ot({
          ...ot.dataValues,
          ...data,
        });

        this.otService
          .update(req.params.id, updatedOt)
          .then(() => res.status(200).json(updatedOt))
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `OT id:${req.params.id} does not exists`,
        });
    });
  }

  delete(req: Request, res: Response) {
    this.otService.get(req.params.id).then((ot) => {
      if (ot) {
        this.otService
          .delete(req.params.id)
          .then((ot) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `OT id:${req.params.id} does not exists`,
        });
    });
  }
}
