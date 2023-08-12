import { CommercialService } from "../services/commercial.service";
import { Commercial } from "../models";
import { getPagingData } from "../helpers";
import { Request, Response } from "express";

export class CommercialController {
  private commercialService: CommercialService;

  constructor() {
    this.commercialService = new CommercialService(Commercial);
  }

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.commercialService
      .getPaged(page, size)
      .then((commerials) => res.status(200).json(getPagingData(commerials)));
  }

  getAll(req: Request, res: Response) {
    this.commercialService
      .getAll()
      .then((commerials) => res.status(200).json(commerials));
  }

  getById(req: Request, res: Response) {
    this.commercialService.get(req.params.id).then((commerials) => {
      if (commerials) res.status(200).json(commerials);
      else {
        res
          .status(400)
          .json({ message: `Commercial ID:${req.params.id} does not exists` });
      }
    });
  }

  post(req: Request, res: Response) {
    let {
      dispatchMode,
      terms,
      price,
      currency,
      billSequence,
      saleTarget,
      notes,
      bankName,
      accNo,
      bramchName,
      ifsc,
    } = req.body;

    let commercial = new Commercial({
      dispatchMode,
      terms,
      price,
      currency,
      billSequence,
      saleTarget,
      notes,
      bankName,
      accNo,
      bramchName,
      ifsc,
    });

    this.commercialService
      .create(commercial)
      .then((commercial) => res.status(200).json(commercial))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let {
      id,
      dispatchMode,
      terms,
      price,
      currency,
      billSequence,
      saleTarget,
      notes,
      bankName,
      accNo,
      bramchName,
      ifsc,
    } = req.body;

    this.commercialService.get(req.params.id).then((commericial) => {
      if (commericial) {
        let updatedCommercial = new Commercial({
          ...commericial.dataValues,
          id,
          dispatchMode,
          terms,
          price,
          currency,
          billSequence,
          saleTarget,
          notes,
          bankName,
          accNo,
          bramchName,
          ifsc,
        });

        this.commercialService
          .update(id, updatedCommercial)
          .then(() => res.status(200).json(updatedCommercial))
          .catch((err) => res.status(400).json(err));
      } else {
        res
          .status(404)
          .json({ message: `Commercial Id:${req.params.id} does not exist` });
      }
    });
  }

  delete(req: Request, res: Response) {
    this.commercialService.get(req.params.id).then((commercial) => {
      if (commercial) {
        this.commercialService
          .delete(req.params.id)
          .then((commercial) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `commercial id:${req.params.id} does not exists` });
    });
  }
}
