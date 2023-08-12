import { sequelize } from "../db";
import { DataTypes, Model } from "sequelize";

export class TransportBill extends Model {}

TransportBill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    consigneeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rcNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gstin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchaseOrderNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exciseNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "transportBill",
    timestamps: false,
    underscored: true,
  }
);
