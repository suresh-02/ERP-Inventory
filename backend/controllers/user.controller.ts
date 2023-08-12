import { Request, Response } from "express";
import { Employee, User } from "../models";
import { UserService } from "../services";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sequelize } from "../db";
import { Op } from "sequelize";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService(User);
  }

  private options = {
    attributes: [
      "id",
      "name",
      "role",
      "email",
      [sequelize.fn("COUNT", "employee.id"), "employeesCount"],
    ],
    include: [
      {
        model: Employee,
        as: "employee",
        attributes: [],
      },
    ],
    where: { role: "MENTOR" },
    group: ["user.id"],
  };

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    this.userService
      .find({ where: { email } })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.dataValues.password).then((checked) => {
            if (checked) {
              const token = jwt.sign(
                {
                  userId: user.dataValues.id,
                  email,
                  role: user.dataValues.role,
                },
                process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "",
                {
                  expiresIn: "2h",
                }
              );
              user.dataValues.token = token;
              delete user.dataValues.password;

              res.status(200).json(user);
            } else {
              res.status(401).send("Invalid Credentials");
            }
          });
        } else res.status(401).send("Invalid Credentials");
      })
      .catch((err) => res.status(400).json(err));
  }

  getAll(req: Request, res: Response) {
    this.userService
      .getAll(this.options)
      .then((users) => {
        return res.status(200).json(users);
      })
      .catch((err: any) => {
        return res.status(400).json(err);
      });
  }

  getById(req: Request, res: Response) {
    let id = req.params.id;
    this.userService
      .get(id, {
        attributes: {
          exclude: ["password"],
        },
      })
      .then((user: any) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        Employee.findAll({
          where: {
            mentorId: {
              [Op.or]: [null, id],
            },
          },
          order: [["mentorId", "ASC"]],
        }).then((employees) => {
          let empId: any = [];
          employees.forEach((s) => empId.push(s.dataValues));
          let data = { ...user.dataValues, employees: employees };
          res.status(200).json(data);
        });
      });
  }

  async post(req: Request, res: Response) {
    const { name, email, password, empId } = req.body;
    // TODO: Validate fields before creating user
    this.userService
      .find({ where: { email } })
      .then((user: any) => {
        if (user)
          return res.status(400).json({ message: "User already exists" });
      })
      .catch((err: any) => res.status(400).json(err));
    const hashPassword = await bcrypt.hash(password, 10);

    let newUser = new User({
      name,
      email,
      password: hashPassword,
      role: "MENTOR",
    });

    const t = await sequelize.transaction();

    this.userService
      .create(newUser)
      .then((user: User) => {
        Employee.update(
          { mentorId: user.dataValues.id },
          { where: { id: empId }, transaction: t }
        )
          .then((upE) => {
            t.commit();
            res.status(201).json(user);
          })
          .catch((err) => {
            t.rollback();
            res.status(400).json(err);
          });
      })
      .catch((err: any) => {
        t.rollback();
        res.status(400).json(err);
      });
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.userService.get(req.params.id).then(async (user) => {
      if (user) {
        let updatedUser = new User({
          ...user.dataValues,
          ...data,
        });

        const t = await sequelize.transaction();

        Employee.findAll({ where: { mentorId: req.params.id } }).then(
          (employees) => {
            let employeeId: any[] = [];
            employees.forEach((employee) => {
              employeeId.push(employee.dataValues.id);
            });
            employeeId = employeeId.filter((id) => !data.empId.includes(id));

            Employee.update(
              { mentorId: null },
              { where: { id: employeeId }, transaction: t }
            ).then(() => {
              User.update(updatedUser.dataValues, {
                where: { id: req.params.id },
                transaction: t,
              })
                .then((upUser) => {
                  delete updatedUser.dataValues.password;
                  if (data.empId.length > 0)
                    Employee.update(
                      { mentorId: updatedUser.dataValues.id },
                      { where: { id: data.empId }, transaction: t }
                    )
                      .then((upS) => {
                        t.commit();
                        res.status(201).json(upUser);
                      })
                      .catch((err) => {
                        t.rollback();
                        res.status(400).json(err);
                      });
                })
                .catch((err) => {
                  t.rollback();
                  res.status(400).json(err);
                });
            });
          }
        );
      } else
        res.status(404).json({
          message: `User id:${req.params.id} does not exists`,
        });
    });
  }

  delete(req: Request, res: Response) {
    this.userService.get(req.params.id).then((user) => {
      if (user) {
        this.userService
          .delete(req.params.id)
          .then((user) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `User id:${req.params.id} does not exists` });
    });
  }
}
