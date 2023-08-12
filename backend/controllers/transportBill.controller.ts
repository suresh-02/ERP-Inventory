import { Request, Response } from "express";
import { TransportBillService } from "../services";
import { TransportBill } from "../models";
import { getPagingData } from "../helpers";
import { TransportBillItem } from "../models/transport-bill-item";
import { sequelize } from "../db";
import { Op } from "sequelize";

export class TransportBillController {
  private transportBillService: TransportBillService;

  constructor() {
    this.transportBillService = new TransportBillService(TransportBill);
  }

  options = {
    include: [
      {
        model: TransportBillItem,
        as: "goods",
      },
    ],
  };

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.transportBillService
      .getPaged(page, size, this.options)
      .then((transportBill) =>
        res.status(200).json(getPagingData(transportBill))
      );
  }

  getAll(req: Request, res: Response) {
    this.transportBillService
      .getAll()
      .then((transportBill) => res.status(200).json(transportBill));
  }

  getById(req: Request, res: Response) {
    this.transportBillService
      .get(req.params.id, this.options)
      .then((transportBill) => {
        if (transportBill) res.status(200).json(transportBill);
        else
          res.status(404).json({
            message: `TransportBill id:${req.params.id} does not exists`,
          });
      });
  }

  async upsert(req: Request, res: Response) {
    let {
      id,
      consigneeName,
      rcNo,
      gstin,
      date,
      purpose,
      vehicleType,
      vehicleNo,
      from,
      to,
      purchaseOrderNo,
      exciseNo,
      remarks,
      goods,
    } = req.body;

    let transportBill: any = {
      consigneeName,
      rcNo,
      gstin,
      date,
      purpose,
      vehicleType,
      vehicleNo,
      from,
      to,
      purchaseOrderNo,
      exciseNo,
      remarks,
    };
    if (id) transportBill = { ...transportBill, id };

    const t = await sequelize.transaction();

    try {
      //! Creating or Updating transportBill
      const [createdBill, isExist] = await TransportBill.upsert(transportBill, {
        transaction: t,
        returning: true,
      });

      //! Updating goods
      let updatedGoods = goods.map((item: any) => ({
        ...item,
        billId: createdBill.dataValues.id,
      }));
      const createdBillItems = await TransportBillItem.bulkCreate(
        updatedGoods,
        {
          transaction: t,
          updateOnDuplicate: ["description", "quantity", "totalAmount"],
          returning: true,
        }
      );

      //! Deleting goods
      const goodsIds: number[] = [];
      updatedGoods.forEach((g: any) => {
        if (g.id) goodsIds.push(g.id);
      });
      createdBillItems.map((g: any) => {
        if (g.dataValues.id) goodsIds.push(g.dataValues.id);
      });
      await TransportBillItem.destroy({
        where: {
          id: { [Op.notIn]: goodsIds },
          billId: createdBill.dataValues.id,
        },
        transaction: t,
      });

      t.commit();
      res.status(201).json(createdBill);
    } catch (err) {
      t.rollback();
      res.status(400).json(err);
    }
  }

  delete(req: Request, res: Response) {
    this.transportBillService.get(req.params.id).then((transportBill) => {
      if (transportBill) {
        this.transportBillService
          .delete(req.params.id)
          .then((transportBill) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `TransportBill id:${req.params.id} does not exists`,
        });
    });
  }
}
