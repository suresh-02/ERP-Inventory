import { sequelize } from "../db";
import { DataTypes, Model } from "sequelize";
import { TransportBill } from "./transport-bill";

export class TransportBillItem extends Model {}

TransportBillItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    billId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TransportBill,
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "transportBillItems",
    timestamps: false,
    underscored: true,
  }
);

TransportBillItem.belongsTo(TransportBill, {
  foreignKey: "billId",
  as: "bill",
  onDelete: "cascade",
});

TransportBill.hasMany(TransportBillItem, {
  foreignKey: "billId",
  as: "goods",
  onDelete: "cascade",
});
