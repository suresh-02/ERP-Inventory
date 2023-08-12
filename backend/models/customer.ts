import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Customer extends Model {}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("PVT", "SUB"),
      allowNull: false,
    },
    salesPerson: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    consignee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    territory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "customer",
    timestamps: false,
    underscored: true,
  }
);
