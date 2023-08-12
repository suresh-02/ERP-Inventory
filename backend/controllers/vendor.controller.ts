import { Request, Response } from "express";
import { VendorService } from "../services";
import { Address, Bank, Vendor } from "../models";
import { getPagingData } from "../helpers";
import { sequelize } from "../db";
import { Op } from "sequelize";

export class VendorController {
  private vendorService: VendorService;

  constructor() {
    this.vendorService = new VendorService(Vendor);
  }

  private options = {
    include: [
      {
        model: Address,
        as: "address",
      },
      {
        model: Bank,
        as: "bank",
      },
    ],
  };

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.vendorService.getPaged(page, size, this.options).then((vendor) => {
      res.status(200).json(getPagingData(vendor));
    });
  }

  getAll(req: Request, res: Response) {
    this.vendorService.getAll(this.options).then((vendor) => {
      res.status(200).json(vendor);
    });
  }

  getById(req: Request, res: Response) {
    this.vendorService.get(req.params.id, this.options).then((vendor) => {
      if (vendor) res.status(200).json(vendor);
      else
        res.status(404).json({
          message: `Vendor id:${req.params.id} does not exists`,
        });
    });
  }

  async upsert(req: Request, res: Response) {
    let {
      id,
      customerId,
      contractor,
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
      bank,
    } = req.body;
    let newVendor: any = {
      contractor,
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
    if (customerId) newVendor = { ...newVendor, customerId };
    if (id) newVendor = { ...newVendor, id };
    const t = await sequelize.transaction();
    // console.log(req.body);
    try {
      //! Creating or Updating vendor
      const [createdVendor, isExist] = await Vendor.upsert(newVendor, {
        transaction: t,
        returning: true,
      });

      //! Creating or Updating address
      let updatedAddress = address.map((a: any) => ({
        ...a,
        vendorId: createdVendor.dataValues.id,
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
          vendorId: createdVendor.dataValues.id,
          id: { [Op.notIn]: addressIds },
        },
        transaction: t,
      });

      //! Creating or Updating Bank
      let updatedBank = bank.map((a: any) => ({
        ...a,
        vendorId: createdVendor.dataValues.id,
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
          vendorId: createdVendor.dataValues.id,
          id: { [Op.notIn]: bankIds },
        },
        transaction: t,
      });

      await t.commit();
      res.status(201).json({
        createdVendor: createdVendor,
        createdAddress,
        createdBank,
      });
    } catch (err) {
      t.rollback();
      console.log(err);
      res.status(400).json(err);
    }
  }

  delete(req: Request, res: Response) {
    this.vendorService.get(req.params.id).then((vendor) => {
      if (vendor) {
        this.vendorService
          .delete(req.params.id)
          .then((vendor) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `Vendor id:${req.params.id} does not exists`,
        });
    });
  }
}
