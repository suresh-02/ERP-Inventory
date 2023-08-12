import { Request, Response } from "express";
import { TransactionService } from "../services";
import { Inventory, Transaction, User } from "../models";
import { getPagingData } from "../helpers";
import { Sequelize } from "sequelize";
import { sequelize } from "../db";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService(Transaction);
  }

  private options = {
    attributes: [
      "id",
      "date",
      "inward",
      "outward",
      "inventoryId",
      [Sequelize.col("inventory.material"), "inventoryItem"],
      [Sequelize.col("user.name"), "userName"],
      [Sequelize.col("user.id"), "userId"],
    ],
    include: [
      { model: Inventory, as: "inventory", attributes: [] },
      { model: User, as: "user", attributes: [] },
    ],
  };

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.transactionService
      .getPaged(page, size, this.options)
      .then((transactions) =>
        res.status(200).json(getPagingData(transactions))
      );
  }

  getAll(req: Request, res: Response) {
    this.transactionService
      .getAll(this.options)
      .then((transactions) => res.status(200).json(transactions));
  }

  getById(req: Request, res: Response) {
    this.transactionService
      .get(req.params.id, this.options)
      .then((transaction) => {
        if (transaction) res.status(200).json(transaction);
        else
          res.status(404).json({
            message: `Transaction id:${req.params.id} does not exists`,
          });
      });
  }

  async post(req: Request, res: Response) {
    let { inventoryId, userId, date, inward, outward } = req.body;
    let transaction = new Transaction({
      inventoryId,
      userId,
      date,
      inward,
      outward,
    });
    const t = await sequelize.transaction();
    //! Finding Inventory Item
    Inventory.findByPk(inventoryId, { transaction: t })
      .then((inventory) => {
        //! Creating Transaction
        Transaction.create(transaction.dataValues, { transaction: t })
          .then((transaction) => {
            //! Finding Inventory Item if transaction created
            if (inventory) {
              if (inward) {
                inventory.dataValues.stock =
                  inventory.dataValues.stock + inward;
              }
              if (outward) {
                inventory.dataValues.usage =
                  inventory.dataValues.usage + outward;
              }
              //! Updating Inventory Item
              Inventory.update(inventory.dataValues, {
                where: { id: inventoryId },
                transaction: t,
              })
                .then((inventory) => {
                  t.commit();
                  res.status(201).json(transaction);
                })
                .catch((err) => {
                  t.rollback();
                  res.status(400).json(err);
                });
            }
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
  }

  update(req: Request, res: Response) {
    let { id, inventoryId, userId, date, inward, outward } = req.body;

    this.transactionService.get(req.params.id).then((transaction) => {
      if (transaction) {
        let updatedTransaction = new Transaction({
          ...transaction.dataValues,
          inventoryId,
          userId,
          date,
          inward,
          outward,
        });

        this.transactionService
          .update(id, updatedTransaction)
          .then(() => res.status(200).json(updatedTransaction))
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Transaction id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.transactionService.get(req.params.id).then(async (transaction) => {
      if (transaction) {
        const t = await sequelize.transaction();
        //! Finding Inventory Item
        Inventory.findByPk(transaction.dataValues.inventoryId, {
          transaction: t,
        })
          .then((inventory) => {
            //! Deleting Transaction
            Transaction.destroy({
              where: { id: req.params.id },
              transaction: t,
            })
              .then(() => {
                //! Finding Inventory Item if transaction deleted
                if (inventory) {
                  if (transaction.dataValues.inward) {
                    inventory.dataValues.stock =
                      inventory.dataValues.stock -
                      transaction.dataValues.inward;
                  }
                  if (transaction.dataValues.outward) {
                    inventory.dataValues.usage =
                      inventory.dataValues.usage -
                      transaction.dataValues.outward;
                  }
                  //! Updating Inventory Item
                  Inventory.update(inventory.dataValues, {
                    where: { id: inventory.dataValues.id },
                    transaction: t,
                  })
                    .then((inventory) => {
                      t.commit();
                      res.status(200).json();
                    })
                    .catch((err) => {
                      t.rollback();
                      res.status(400).json(err);
                    });
                }
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
      } else
        res
          .status(404)
          .json({ message: `Transaction id:${req.params.id} does not exists` });
    });
  }
}
