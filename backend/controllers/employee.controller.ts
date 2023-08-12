import { Request, Response } from "express";
import { Attendance, Department, Employee, User } from "../models";
import { EmployeeService } from "../services";
import { getPagingData } from "../helpers";
import { Op, Sequelize } from "sequelize";

export class EmployeeController {
  private employeeService: EmployeeService;
  constructor() {
    this.employeeService = new EmployeeService(Employee);
  }

  private options = {
    attributes: [
      "id",
      "name",
      "empId",
      "mentorId",
      [Sequelize.col("mentor.name"), "mentorName"],
    ],
    include: [
      { model: User, as: "mentor", attributes: [] },
      { model: Department, as: "department" },
    ],
  };

  private dayOptions = {
    attributes: [
      "id",
      "date",
      "employeeId",
      [Sequelize.col("employee.name"), "employeeName"],
      [Sequelize.col("employee.emp_id"), "employeeEmpId"],
      [Sequelize.col("employee.mentor_id"), "mentorId"],
    ],
    include: [
      {
        model: Employee,
        as: "employee",
        attributes: [],
        order: [["name", "ASC"]],
      },
    ],
  };

  getPaged(req: Request, res: Response) {
    const { page, size, mentor, search, fMentor }: any = req.query;
    let where = {};
    if (fMentor) {
      if (fMentor.includes("null")) {
        if (typeof fMentor === "object") {
          fMentor.splice(fMentor.indexOf("null"), 1);
          where = {
            ...where,
            mentorId: {
              [Op.or]: [null, ...fMentor],
            },
          };
        } else where = { ...where, mentorId: { [Op.eq]: null } };
      } else where = { ...where, mentorId: fMentor };
    }
    if (mentor) {
      if (mentor != "null") where = { ...where, mentorId: mentor };
      else where = { ...where, mentorId: null };
    }
    if (search)
      where = {
        ...where,
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            empId: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      };
    let fOptions: any = { ...this.options, where };
    this.employeeService
      .getPaged(page, size, fOptions)
      .then((sections) => res.status(200).json(getPagingData(sections)));
  }

  getAll(req: Request, res: Response) {
    this.employeeService
      .getAll(this.options)
      .then((employees) => {
        return res.status(200).json(employees);
      })
      .catch((err: any) => {
        return res.status(400).json(err);
      });
  }

  getUnassigned(req: Request, res: Response) {
    this.employeeService
      .getAll({
        where: {
          mentorId: {
            [Op.eq]: null,
          },
        },
      })
      .then((employees) => {
        return res.status(200).json(employees);
      })
      .catch((err: any) => {
        return res.status(400).json(err);
      });
  }

  getById(req: Request, res: Response) {
    let id = req.params.id;
    this.employeeService
      .get(id, {
        ...this.options,
        attributes: {
          exclude: ["password"],
        },
      })
      .then((employee: any) => {
        if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
        }
        return res.status(200).json(employee);
      });
  }

  post(req: Request, res: Response) {
    const { name, empId, deptId } = req.body;
    this.employeeService
      .find({ where: { empId } })
      .then((employee: any) => {
        if (employee)
          return res.status(400).json({ message: "Employee already exists" });
        else {
          let newEmployee = new Employee({
            name,
            empId,
            deptId,
          });
          this.employeeService
            .create(newEmployee)
            .then((employee: Employee) => res.status(200).json(employee))
            .catch((err: any) => res.status(400).json(err));
        }
      })
      .catch((err: any) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    this.employeeService.get(id).then((employee) => {
      if (employee) {
        delete employee.dataValues.password;
        let updatedEmployee = new Employee({
          ...employee.dataValues,
          ...data,
        });
        this.employeeService
          .update(id, updatedEmployee)
          .then((employee: any) => res.status(200).json(employee))
          .catch((err: any) => res.status(400).json(err));
      } else
        return res
          .status(404)
          .json({ message: `Employee id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.employeeService.get(req.params.id).then((employee) => {
      if (employee) {
        this.employeeService
          .delete(req.params.id)
          .then((employee) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Employee id:${req.params.id} does not exists` });
    });
  }

  getDayPresent(req: Request, res: Response) {
    const { mentor, date }: any = req.query;
    let preEmployees: Employee[];
    User.findByPk(mentor).then((user) => {
      let where = {};
      if (user?.dataValues.role != "ADMIN")
        where = { ...where, mentorId: mentor };
      Employee.findAll({ where, order: [["name", "ASC"]] }).then(
        (employees) => {
          preEmployees = employees;
          let options: any = this.dayOptions;
          where = {
            date: new Date(String(date)),
          };
          if (date)
            options = {
              ...options,
              where,
            };
          Attendance.findAll(options).then((absEmployees) => {
            absEmployees.forEach((abs) => {
              preEmployees = preEmployees.filter(
                (pre) => pre.dataValues.id != abs.dataValues.employeeId
              );
            });
            if (user?.dataValues.role != "ADMIN")
              absEmployees = absEmployees.filter(
                (abs) => abs.dataValues.mentorId === parseInt(mentor)
              );
            res.status(200).json({ preEmployees, absEmployees });
          });
        }
      );
    });
  }
}
