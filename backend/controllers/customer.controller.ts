import { Request, Response } from "express";
import { CustomerService } from "../services";
import { Address, Bank, Commercial, Customer } from "../models";
import { getPagingData } from "../helpers";
import { sequelize } from "../db";
import { Op } from "sequelize";

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService(Customer);
  }

  private options = {
    include: [
      {
        model: Address,
        as: "address",
      },
      {
        model: Commercial,
        as: "commercial",
      },
      {
        model: Bank,
        as: "bank",
      },
    ],
  };

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.customerService.getPaged(page, size, this.options).then((customer) => {
      res.status(200).json(getPagingData(customer));
    });
  }

  getAll(req: Request, res: Response) {
    this.customerService.getAll(this.options).then((customer) => {
      res.status(200).json(customer);
    });
  }

  getById(req: Request, res: Response) {
    this.customerService.get(req.params.id, this.options).then((customer) => {
      if (customer) res.status(200).json(customer);
      else
        res.status(404).json({
          message: `Customer id:${req.params.id} does not exists`,
        });
    });
  }

  async upsert(req: Request, res: Response) {
    let {
      id,
      code,
      name,
      shortName,
      type,
      salesPerson,
      consignee,
      territory,
      phoneNo,
      website,
      address,
      commercial,
      bank,
    } = req.body;
    let newCustomer: any = {
      code,
      name,
      shortName,
      type,
      salesPerson,
      consignee,
      territory,
      status: "ACTIVE",
      phoneNo,
      website,
    };
    if (id) newCustomer = { ...newCustomer, id };
    const t = await sequelize.transaction();
    // console.log(req.body);
    try {
      //! Creating or Updating customer
      const [createdCustomer, isExist] = await Customer.upsert(newCustomer, {
        transaction: t,
        returning: true,
      });

      //! Creating or Updating address
      let updatedAddress = address.map((a: any) => ({
        ...a,
        customerId: createdCustomer.dataValues.id,
      }));
      const createdAddress = await Address.bulkCreate(updatedAddress, {
        transaction: t,
        updateOnDuplicate: ["id", "line1", "line2", "line3", "city"],
      });

      //! Deleting address
      const addressIds: number[] = [];
      updatedAddress.forEach((a: any) => {
        if (a.id) addressIds.push(a.id);
      });
      createdAddress.map((a: any) => {
        if (a.dataValues.id) addressIds.push(a.dataValues.id);
      });
      await Address.destroy({
        where: {
          customerId: createdCustomer.dataValues.id,
          id: { [Op.notIn]: addressIds },
        },
        transaction: t,
      });

      let createdCommercial: any;
      //! Creating or Updating Commercial
      if (commercial) {
        let updatedCommercial = {
          ...commercial,
          customerId: createdCustomer.dataValues.id,
        };
        createdCommercial = await Commercial.upsert(updatedCommercial, {
          transaction: t,
          returning: true,
        });
      }

      //! Creating or Updating Bank
      let updatedBank = bank.map((a: any) => ({
        ...a,
        customerId: createdCustomer.dataValues.id,
      }));
      const createdBank = await Bank.bulkCreate(updatedBank, {
        transaction: t,
        updateOnDuplicate: ["id", "name", "accNo", "branch", "ifsc"],
      });

      //! Deleting bank
      const bankIds: number[] = [];
      updatedBank.forEach((b: any) => {
        if (b.id) bankIds.push(b.id);
      });
      createdBank.map((a: any) => {
        if (a.dataValues.id) bankIds.push(a.dataValues.id);
      });
      await Bank.destroy({
        where: {
          customerId: createdCustomer.dataValues.id,
          id: { [Op.notIn]: bankIds },
        },
        transaction: t,
      });

      await t.commit();
      res.status(201).json({
        createdCustomer,
        createdAddress,
        createdCommercial,
        createdBank,
      });
    } catch (err) {
      t.rollback();
      console.log(err);
      res.status(400).json(err);
    }
  }

  delete(req: Request, res: Response) {
    this.customerService.get(req.params.id).then((customer) => {
      if (customer) {
        this.customerService
          .delete(req.params.id)
          .then((customer) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `Customer id:${req.params.id} does not exists`,
        });
    });
  }
}
