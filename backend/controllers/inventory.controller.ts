import { Request, Response } from "express";
import { InventoryService } from "../services";
import { Inventory } from "../models";
import { getPagingData } from "../helpers";

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService(Inventory);
  }

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.inventoryService
      .getPaged(page, size)
      .then((inventories) => res.status(200).json(getPagingData(inventories)));
  }

  getAll(req: Request, res: Response) {
    this.inventoryService
      .getAll()
      .then((inventories) => res.status(200).json(inventories));
  }

  getById(req: Request, res: Response) {
    this.inventoryService.get(req.params.id).then((inventory) => {
      if (inventory) res.status(200).json(inventory);
      else
        res
          .status(404)
          .json({ message: `Inventory id:${req.params.id} does not exists` });
    });
  }

  post(req: Request, res: Response) {
    let { material, stock, usage, unit } = req.body;
    let inventory = new Inventory({ material, stock, usage, unit });
    this.inventoryService
      .create(inventory)
      .then((inventory) => res.status(201).json(inventory))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let { id, material, stock, usage, unit } = req.body;

    this.inventoryService.get(req.params.id).then((inventory) => {
      if (inventory) {
        let updatedInventory = new Inventory({
          ...inventory.dataValues,
          material,
          stock,
          usage,
          unit,
        });

        this.inventoryService
          .update(id, updatedInventory)
          .then(() => res.status(200).json(updatedInventory))
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Inventory id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.inventoryService.get(req.params.id).then((inventory) => {
      if (inventory) {
        this.inventoryService
          .delete(req.params.id)
          .then((inventory) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Inventory id:${req.params.id} does not exists` });
    });
  }
}
