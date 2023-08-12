import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Inventory extends Model {}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    usage: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM,
      values: ["kg", "l", "nos"],
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "inventory",
    timestamps: false,
    underscored: true,
  }
);
