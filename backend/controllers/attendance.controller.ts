import { Request, Response } from "express";
import { AttendanceService } from "../services";
import { Attendance, Employee } from "../models";
import { getPagingData } from "../helpers";
import { Sequelize } from "sequelize";

export class AttendanceController {
  private dayAttendanceService: AttendanceService;

  constructor() {
    this.dayAttendanceService = new AttendanceService(Attendance);
  }

  private options = {
    attributes: [
      "id",
      "date",
      "employeeId",
      [Sequelize.col("employee.name"), "employeeName"],
    ],
    include: [
      {
        model: Employee,
        as: "employee",
      },
    ],
  };

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.dayAttendanceService
      .getPaged(page, size, this.options)
      .then((dayAttendance) => {
        res.status(200).json(getPagingData(dayAttendance));
      });
  }

  getAll(req: Request, res: Response) {
    this.dayAttendanceService.getAll(this.options).then((dayAttendance) => {
      res.status(200).json(dayAttendance);
    });
  }

  getById(req: Request, res: Response) {
    this.dayAttendanceService
      .get(req.params.id, this.options)
      .then((dayAttendance) => {
        if (dayAttendance) res.status(200).json(dayAttendance);
        else
          res.status(404).json({
            message: `Attendance id:${req.params.id} does not exists`,
          });
      });
  }

  post(req: Request, res: Response) {
    let data = req.body;

    let employees = data.employeeId;
    delete data.employeeId;

    let absentees: any[] = [];
    employees?.forEach((s: any) => {
      absentees.push({ ...data, employeeId: s });
    });

    if (absentees.length === 0)
      return res.status(400).json({ errorMessage: "Employees required" });

    Attendance.bulkCreate(absentees)
      .then((dayAttendance) => {
        res.status(201).json(dayAttendance);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  delete(req: Request, res: Response) {
    this.dayAttendanceService.get(req.params.id).then((dayAttendance) => {
      if (dayAttendance) {
        this.dayAttendanceService
          .delete(req.params.id)
          .then((dayAttendance) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `Attendance id:${req.params.id} does not exists`,
        });
    });
  }

  bulkDelete(req: Request, res: Response) {
    const { id }: any = req.query;

    Attendance.destroy({
      where: {
        id: id.split(","),
      },
    })
      .then((dayAttendance) => res.status(200).json())
      .catch((err) => res.status(400).json(err));
  }
}
